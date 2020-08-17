try {
  let originalFixedCount = 0; let positiveCount = 0; let undefinedCount = 0; let translatedFixedCount = 0
  const isMultilingualEnabled = documentServices.language.multilingual.isEnabled()
  const originalLanguage = isMultilingualEnabled ? documentServices.language.original.get() : { code: undefined }
  const languages = documentServices.language.get()
  const nonOriginalLanguages = _.reject(languages, language => language.code === originalLanguage.code)

  const allMenus = _.map(documentServices.menu.getAll(), 'id')

  const getItems = obj => [obj, ...obj.items ? obj.items.map(getItems) : []]

  const itemsByMenuInLang = (langCode, menuId) => ({
    menuId,
    items: _.flatMapDeep(
      isMultilingualEnabled
        ? documentServices.multilingual.menu.get(langCode, menuId).items
        : documentServices.menu.getById(menuId).items
      , getItems)
  })
  const updateFunctionInLang = (langCode) => isMultilingualEnabled
    ? _.partial(documentServices.multilingual.menu.updateItem, langCode)
    : documentServices.menu.updateItem

  const runUpdateItems = (itemsByMenu, updateFunction, accFunc) => {
    itemsByMenu.forEach(({ menuId, items }) => {
      items.forEach(menuItem => {
        if (menuItem.displayCount === 0) {
          menuItem.displayCount = null
          accFunc()
          updateFunction(menuId, menuItem.id,
            // _.pick(
            menuItem
            // , ['id', 'type', 'displayCount'])
          )
        } else if (menuItem.displayCount > 0) {
          positiveCount++
        } else if (menuItem.displayCount === undefined) {
          undefinedCount++
        }
      })
    })
  }

  const originalLanguageItemsByMenu = allMenus.map(menuId => itemsByMenuInLang(originalLanguage.code, menuId))
  const updateOriginalLanguageFunction = updateFunctionInLang(originalLanguage.code)

  runUpdateItems(originalLanguageItemsByMenu, updateOriginalLanguageFunction, () => { originalFixedCount++ })

  nonOriginalLanguages.forEach(language => {
    const languageItemsByMenu = allMenus.map(menuId => itemsByMenuInLang(language.code, menuId))
    runUpdateItems(languageItemsByMenu, updateFunctionInLang(language.code), () => { translatedFixedCount++ })
  })

  window.autopilot.reportResult({
    isMultilingualEnabled,
    mockRun: false,
    originalFixedCount,
    translatedFixedCount,
    positiveCount,
    undefinedCount
  })
} catch (e) {
  window.autopilot.reportError(e)
}
