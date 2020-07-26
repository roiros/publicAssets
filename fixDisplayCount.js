try {
  menus=documentServices.menu.getAll()
  menus.map(menu=>
    menu.items.map(mi=>{
      if (mi.displayCount===0) {
        mi.displayCount=undefined;
        documentServices.menu.updateItem(menu.id,mi.id,mi)
      }
    })
    )
    window.autopilotJsonp({
  })
} catch (e) {
  window.autopilotJsonp(null, e)
}
