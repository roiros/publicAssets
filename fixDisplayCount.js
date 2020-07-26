try {
  let fixedCount=0,positiveCount=0,undefinedCount=0
  const menus=documentServices.menu.getAll()
  menus.map(menu=>
    menu.items.map(menuItem=>{
      if (menuItem.displayCount===0) {
        menuItem.displayCount=undefined;
        fixedCount++
        documentServices.menu.updateItem(menu.id,menuItem.id,menuItem)
      } else if (menuItem.displayCount>0) {
        positiveCount++
      } else if (menuItem.displayCount === undefined){
        undefinedCount++
      }
    }))
    window.autopilotJsonp({
      fixedCount,
      positiveCount,
      undefinedCount
  })
} catch (e) {
  window.autopilotJsonp(null, e)
}
