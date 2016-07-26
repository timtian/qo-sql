%lex

%options case-insensitive

%%

[/][*](.|\n)*?[*][/]                                /* skip comments */
\s+                                                 /* skip whitespace */

\[([^\]])*?\]							            return 'BRALITERAL'
\`([^\`])*?\`	   						            return 'BRALITERAL'
\$\{([\s\S]+?)\}                                    return 'TEMPLATE_PARAM'
N(['](\\.|[^']|\\\')*?['])+                         return 'NSTRING'
X(['](\\.|[^']|\\\')*?['])+                         return 'NSTRING'
(['](\\.|[^']|\\\')*?['])+                          return 'STRING'
(["](\\.|[^"]|\\\")*?["])+                          return 'STRING'



'SELECT'                                            return 'SELECT'
'TOP'                                               return 'TOP'
'LIMIT'                                             return 'LIMIT'
'FROM'                                              return 'FROM'
'WHERE'                                             return 'WHERE'
'DISTINCT'                                          return 'DISTINCT'
GROUP\s+BY\b                                        return 'GROUP_BY'
ORDER\s+BY\b                                        return 'ORDER_BY'

'+'												    return 'PLUS'
'-' 											    return 'MINUS'
'*'												    return 'STAR'
'/'												    return 'SLASH'
'>='											    return 'GE'
'>'												    return 'GT'
'<='											    return 'LE'
'<>'											    return 'NE'
'<'												    return 'LT'
'='												    return 'EQ'
'!='											    return 'NE'
'('												    return 'LPAR'
')'												    return 'RPAR'
'{'												    return 'LCUR'
'}'												    return 'RCUR'
'['												    return 'LBRA'
']'												    return 'RBRA'
'.'												    return 'DOT'
','												    return 'COMMA'
'$'												    return 'DOLLAR'
'!'												    return 'EXCLAMATION'
'AS'                                                return 'AS'
'EXISTS'                                            return 'EXISTS'
'IS'                                                return 'IS'
'IN'                                                return 'IN'
'ON'                                                return 'ON'
'AND'                                               return 'AND'
'OR'                                                return 'OR'
'NOT'                                               return 'NOT'
INNER\s+JOIN\b                                      return 'INNER_JOIN'
LEFT\s+OUTER\s+JOIN\b                               return 'LEFT_OUTER_JOIN'
RIGHT\s+OUTER\s+JOIN\b                              return 'RIGHT_OUTER_JOIN'
JOIN\b                                              return 'JOIN'
LEFT\s+JOIN\b                                       return 'LEFT_JOIN'
RIGHT\s+JOIN\b                                      return 'RIGHT_JOIN'
'LIKE'                                              return 'LIKE'
'ASC'                                               return 'ASC'
'DESC'                                              return 'DESC'
'NULL'                                              return 'NULL'
true\b                                              return 'TRUE'
'false'                                             return 'FALSE'
false\b                                             return 'BOOLEAN'
[0-9]+(\.[0-9]+)?                                   return 'NUMBER'
[a-zA-Z_][a-zA-Z_0-9]*                     		    return 'LITERAL'
<<EOF>>                                             return 'EOF'
.                                                   return 'INVALID'


/lex

%left AND OR
%left EQ NE GE GT LE LT LIKE IS
%left PLUS MINUS
%left STAR SLASH
%left NOT
$left IN
%ebnf

%start main

%% /* language grammar */

Literal
	: LITERAL {$$ = $1;}
	| BRALITERAL { $$ = $1.substr(1,$1.length-2); }
	;

String
	: STRING { $$ = $1.substr(1,$1.length-2).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'"); }
	| NSTRING { $$ = $1.substr(2,$1.length-3).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'"); }
	;


main
	: Statement EOF { return $1 }
	;

Statement
	: { $$ = undefined; }
	| Select
	;

/* SELECT */
Select
	: SELECT DistinctClause ColumnsClause FromClause WhereClause GroupClause OrderClause LimitClause
	    {
	        $$ = {distinct: $2, columns: $3, from: $4, where:$5, group:$6, order:$7, limit:$8};
	    }
	;

DistinctClause
    : { $$ = false; }
    | DISTINCT { $$ = true; }
    ;

TopClause
    : { $$ = null; }
    | TOP NUMBER { $$ = $2; }
    | TOP ParamValue { $$ = $2; }
    ;
LimitClause
    : { $$ = null;}
    | LIMIT Expression { $$ = [0, $2]}
    | LIMIT Expression COMMA Expression { $$ = [$2, $4]}
    ;

ColumnsClause
	: ColumnsClause COMMA Column
		{ $3.colIndex = $1.push($3) - 1; $$ = $1; }
	| Column
		{ $1.colIndex = 0; $$ = [$1]; }
	;

Column
	: Expression AS Literal
		{ $1.as = $3; $$ = $1;}
	| Expression Literal
		{ $1.as = $2; $$ = $1;}
	| Expression AS NUMBER
		{ $1.as = $3; $$ = $1;}
	| Expression NUMBER
		{ $1.as = $2; $$ = $1;}
	| Expression AS StringValue
		{ $1.as = $3; $$ = $1;}
	| Expression StringValue
		{ $1.as = $2; $$ = $1;}
	| Expression
		{ $$ = $1; }
	;


ColumnName
	: ColumnName DOT Literal
		{ $1.value.push($3); $$ = $1;}
	| Literal
		{ $$ = new yy.Column({value:[$1], as:$1});}
    | STAR
        { $$ = new yy.Column({value:['*']})}
	;


Expression
    : Op
        { $$ = $1; }
    | ColumnName
        { $$ = $1; }
    | NumValue
        { $$ = $1; }
    | LogicValue
        { $$ = $1; }
    | StringValue
        { $$ = $1; }
    | ParamValue
        { $$ = $1; }
    | FunctionValue
        { $$ = $1; }
    ;

NumValue
	: NUMBER
		{  $$ = new yy.Value({value:parseFloat($1)}); }
    | MINUS NUMBER
        {  $$ = new yy.Value({value: -parseFloat($2)}); }
	;

LogicValue
	: TRUE
		{ $$ = new yy.Value({value:true}); }
	| FALSE
		{ $$ = new yy.Value({value:false}); }
	;

StringValue
	: STRING
		{ $$ = new yy.Value({value: $1.substr(1,$1.length-2).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")}); }
	| NSTRING
		{ $$ = new yy.Value({value: $1.substr(2,$1.length-3).replace(/(\\\')/g,"'").replace(/(\'\')/g,"'")}); }
	;

Op
	: LPAR Op RPAR
	    { $$ = $2 }
	| Expression PLUS Expression
		{ $$ = new yy.Op({left:$1, op:'+', right:$3}); }
	| Expression MINUS Expression
		{ $$ = new yy.Op({left:$1, op:'-', right:$3}); }
	| Expression STAR Expression
		{ $$ = new yy.Op({left:$1, op:'*', right:$3}); }
	| Expression SLASH Expression
		{ $$ = new yy.Op({left:$1, op:'/', right:$3}); }
	| Expression GT Expression
		{ $$ = new yy.Op({left:$1, op:'>' , right:$3}); }
	| Expression GE Expression
		{ $$ = new yy.Op({left:$1, op:'>=' , right:$3}); }
	| Expression LT Expression
		{ $$ = new yy.Op({left:$1, op:'<' , right:$3}); }
	| Expression LE Expression
		{ $$ = new yy.Op({left:$1, op:'<=' , right:$3}); }
	| Expression EQ Expression
		{ $$ = new yy.Op({left:$1, op:'=' , right:$3}); }
	| Expression NE Expression
		{ $$ = new yy.Op({left:$1, op:'!=' , right:$3}); }
	| Expression AND Expression
		{ $$ = new yy.Op({left:$1, op:'AND', right:$3}); }
	| Expression OR Expression
		{ $$ = new yy.Op({left:$1, op:'OR' , right:$3}); }
	| Expression IN LPAR ExpressionList RPAR
	    { $$ = new yy.Op({left:$1, op:'IN' , right:$4}); }
	| Expression NOT IN LPAR ExpressionList RPAR
    	{ $$ = new yy.Op({left:$1, op:'NOT IN' , right:$5}); }
    | Expression IN TEMPLATE_PARAM
       	{ $3 = new yy.ParamValue({value:$3}); $3.index = (yy.paramList.push($3) - 1);  $$ = new yy.Op({left:$1, op:'IN' , right:$3}); }
    | Expression NOT IN TEMPLATE_PARAM
        { $4 = new yy.ParamValue({value:$4}); $4.index = (yy.paramList.push($4) - 1); $$ = new yy.Op({left:$1, op:'NOT IN' , right:$4}); }
	;



ParamValue
    : TEMPLATE_PARAM { $1 = new yy.ParamValue({value:$1}); $1.index = (yy.paramList.push($1) - 1); $$ = $1;}
    | LPAR TEMPLATE_PARAM RPAR { $2 = new yy.ParamValue({value:$2}); $2.index = (yy.paramList.push($2) - 1); $$ = $2; }
    ;

FunctionValue
    : ColumnName LPAR Expression RPAR { $$ = new yy.FunctionValue({name: $1.value.join('.') , params: $3}) }
    ;

ExpressionList
    : Expression { $$ = [$1] }
    | ExpressionList COMMA Expression { $1.push($3); $$ = $1; }
    ;

WhereClause
	:  { $$ = undefined; }
	| WHERE Expression
		{ $$ = $2; }
	;

GroupClause
    : { $$ = undefined; }
    | GROUP_BY GroupArgs { $$ = $2; }
    ;

GroupArgs
    : GroupArg { $$ = [$1] }
    | GroupArgs COMMA GroupArg { $1.push($3); $$ = $1 }
    ;

GroupArg
    : ColumnName { $$ = $1; }
    | ParamValue { $$ = $1; }
    ;



FromClause
	: FROM Table
		{ $$ = { from: $2 }; }
	| FROM Table Joins
		{ $$ = { from: $2, joins: $3 }; }
	| FROM LPAR Table Joins RPAR
		{ $$ = { from: $3, joins: $4 }; }
	|
		{ $$ = undefined; }
	;


Table
	: Table DOT Literal
     	{ $$ = $1.push($3); }
    | Table AS Literal
        { $1.as = $3; $$ = $1}
	| Literal
		{ $$ = [$1];}
    | ParamValue
        { $$ = [$1];}

	;

Joins
    : Join
        { $$ = [$1] }
    | Joins Join
        { $$ =  $1.concat($2) }
    ;

Join
    : JOIN Table ON Expression
        { $$ = new yy.Join({source:$2, cond:$4, type:'INNER_JOIN'})}
    | INNER_JOIN Table ON Expression
        { $$ = new yy.Join({source:$2, cond:$4, type:'INNER_JOIN'})}
    ;




OrderClause
    : { $$ = undefined;}
    | ORDER_BY OrderArgs { $$ = $2 }
    ;

OrderArgs
    : OrderArg { $$ = [$1] }
    | OrderArgs COMMA OrderArg { $1.push($3); $$ = $1 }
    ;


OrderArg
    : ColumnName { $$ = new yy.OrderValue({column:$1, order:'ASC'}); }
    | ParamValue { $$ = new yy.OrderValue({column:$1, order:'ASC'}); }
    | OrderArg OrderType { $1.order = $2; $$ = $1; }
    ;

OrderType
    : ASC { $$ = 'ASC'}
    | DESC { $$ = 'DESC'}
    | ParamValue { $$ = $1}
    ;