'use babel'

import KeymapDisplayView from './keymap-display-view'
import { CompositeDisposable } from 'atom'

function hideAllItems () {
  var contentItems = document.querySelectorAll('.atom-keymap-display-package .content > ul > li')
  for (var i = 1; i < contentItems.length; i++) {
    contentItems[i].setAttribute('style', 'display: none;')
  }
}

// show group
function showGroup (selectedGroup) {
  hideAllItems()
  if (selectedGroup.textContent === 'Tree View') {
    var treeKeys = document.querySelectorAll('.tree-keys')
    treeKeys.forEach(function (treeKey, index) {
      treeKey.setAttribute('style', 'display: table-row;')
    })
  } else if (selectedGroup.textContent === 'Packages') {
    var packagesKeys = document.querySelectorAll('.packages-keys')
    packagesKeys.forEach(function (packagesKey, index) {
      packagesKey.setAttribute('style', 'display: table-row;')
    })
  } else if (selectedGroup.textContent === 'Custom') {
    var customKeys = document.querySelectorAll('.custom-keys')
    customKeys.forEach(function (customKey, index) {
      customKey.setAttribute('style', 'display: table-row;')
    })
  }
}

function resetButtons () {
  var buttons = document.querySelectorAll('.group-buttons ul li')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].className = ''
  }
}

// TODO: remove this event on deactivation of this package.
function selectGroup (event) {
  resetButtons()
  var selectedGroup = event.target
  var firstGroup = document.querySelectorAll('.group-buttons ul li')[0]
  selectedGroup.className = ''
  if (selectedGroup) {
    selectedGroup.className = 'selected'
    showGroup(selectedGroup)
  } else {
    firstGroup.className = 'selected'
    showGroup(firstGroup)
  }
}

export default {

  keymapDisplayView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.keymapDisplayView = new KeymapDisplayView(state.keymapDisplayViewState)
    this.modalPanel = window.atom.workspace.addModalPanel({
      item: this.keymapDisplayView.getElement(),
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(window.atom.commands.add('atom-workspace', {
      'keymap-display:toggle': () => this.toggle(),
      'keymap-display:change-groups': () => this.changeGroups()
    }))
    var buttons = document.querySelectorAll('.group-buttons ul li')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', selectGroup, false)
    }
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.keymapDisplayView.destroy()
  },

  serialize () {
    return {
      keymapDisplayViewState: this.keymapDisplayView.serialize()
    }
  },

  changeGroups () {
    if (this.modalPanel.visible === true) {
      // shifts between buttons.
      var selectedGroup = document.querySelector('.group-buttons ul li.selected')
      var firstGroup = document.querySelectorAll('.group-buttons ul li')[0]
      selectedGroup.className = ''
      if (selectedGroup.nextElementSibling) {
        selectedGroup.nextElementSibling.className = 'selected'
        showGroup(selectedGroup.nextElementSibling)
      } else {
        firstGroup.className = 'selected'
        showGroup(firstGroup)
      }
    }
  },

  toggle () {
    document.querySelector('.atom-keymap-display-package').style.maxHeight =
    String(window.atom.getSize().height - 200) + 'px'
    window.addEventListener('resize', function (event) {
      document.querySelector('.atom-keymap-display-package').style.maxHeight =
      String(window.atom.getSize().height - 200) + 'px'
    }, false)
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
      // this.modalPanel.show()
    )
  }
}
