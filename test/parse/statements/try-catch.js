({

/** try {} catch {} **/
"catch binding is optional":
{
  type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ {
       type: 'TryStatement',
       start: 0,
       end: 15,
       block: { type: 'Block', start: 4, end: 6, statements: [] },
       handler:
        {
          type: 'CatchClause',
          start: 7,
          end: 15,
          param: null,
          body: { type: 'Block', start: 13, end: 15, statements: [] } },
       finalizer: null } ] }

})
