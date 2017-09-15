'use babel'

export default class KeymapDisplayView {

  constructor (serializedState) {
    // Create root element.
    this.element = document.createElement('div')
    this.element.classList.add('atom-keymap-display-package')

    // Create content container of custom keyboard shortcuts.
    const content = document.createElement('div')
    content.classList.add('content')

    // Create and add main heading.
    const mainHeading = document.createElement('div')
    mainHeading.classList.add('main-heading')
    // Adds textContent to main heading
    const toggleCommand = window.atom.keymaps.findKeyBindings({'command': 'keymap-display:toggle'})[0].keystrokes
    mainHeading.textContent = 'Keymap Display (Press: ' + toggleCommand + ' to close this panel.)'
    content.appendChild(mainHeading)

    // Create buttons to toggle shortcut groups.
    const groupToggle = document.createElement('div')
    groupToggle.classList.add('group-buttons')
    const groupButtonList = document.createElement('ul')
    const importantItem = document.createElement('li')
    importantItem.textContent = 'Important'
    const treeItem = document.createElement('li')
    treeItem.textContent = 'Tree View'
    const packagesItem = document.createElement('li')
    packagesItem.textContent = 'Packages'
    const customItem = document.createElement('li')
    customItem.textContent = 'Custom'
    customItem.className = 'selected'
    groupButtonList.appendChild(importantItem)
    groupButtonList.appendChild(treeItem)
    groupButtonList.appendChild(packagesItem)
    groupButtonList.appendChild(customItem)
    groupToggle.appendChild(groupButtonList)
    content.appendChild(groupToggle)

    // Create the keymaps list to hold keyboard shortcuts.
    const customKeymapsList = document.createElement('ul')

    // Create keyboard shortcuts List headings.
    const keymapsHeadings = document.createElement('li')
    const commandHeading = document.createElement('span')
    commandHeading.textContent = 'Commands'
    const keysHeading = document.createElement('span')
    keysHeading.textContent = 'KeyBoard Shortcuts'
    keymapsHeadings.appendChild(commandHeading)
    keymapsHeadings.appendChild(keysHeading)

    // Add keyboard shortcuts List headings.
    customKeymapsList.appendChild(keymapsHeadings)

    // Create keyboard shortcuts list items.
    const keyBindings = window.atom.keymaps.getKeyBindings()
    const userConfigPath = window.atom.config.getUserConfigPath()
    const atomFolderPath = userConfigPath.substring(0, userConfigPath.indexOf('config.cson'))
    const customKeysPath = atomFolderPath + 'keymap.cson'
    keyBindings.forEach(function (keyBinding, index, array) {
      if (keyBinding.source === customKeysPath ||
        keyBinding.source.substring(0, 4) !== 'core' // filter
      ) {
        const customKeymapsItem = document.createElement('li')
        const command = document.createElement('span')
        command.textContent = keyBinding.command
        const keystrokes = document.createElement('span')
        keystrokes.textContent = keyBinding.keystrokes
        customKeymapsItem.appendChild(command)
        customKeymapsItem.appendChild(keystrokes)
        customKeymapsList.appendChild(customKeymapsItem)
      }
    })

    // Add keys list.
    content.appendChild(customKeymapsList)
    this.element.appendChild(content)
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    this.element.remove()
  }

  getElement () {
    return this.element
  }

}
