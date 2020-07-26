try {
  fixed=0
  menus=documentServices.menu.getAll()
  menus.map(menu=>
    menu.items.map(mi=>{
      if (mi.displayCount===0) {
        mi.displayCount=undefined;
        fixed++
        documentServices.menu.updateItem(menu.id,mi.id,mi)
      }
    })
    )
    window.autopilotJsonp({
      fixed
  })
} catch (e) {
  window.autopilotJsonp(null, e)
}

