'use babel'
import KeymapDisplayView from './keymap-display-view'
import { CompositeDisposable } from 'atom'
function hideAllKeys () {
  var contentItems = document.querySelectorAll('.atom-keymap-display-package .content > ul > li')
  for (var i = 0; i < contentItems.length; i++) {
    contentItems[i].setAttribute('data-show-key', 'no')
  }
}
// show group
function showGroup (selectedGroup) {
  hideAllKeys()
  if (selectedGroup.textContent === 'Tree View') {
    var treeKeys = document.querySelectorAll('.tree-keys')
    treeKeys.forEach(function (treeKey, index) {
      treeKey.setAttribute('data-show-key', 'yes')
    })
  } else if (selectedGroup.textContent === 'Packages') {
    var packagesKeys = document.querySelectorAll('.packages-keys')
    packagesKeys.forEach(function (packagesKey, index) {
      packagesKey.setAttribute('data-show-key', 'yes')
    })
  } else if (selectedGroup.textContent === 'Custom') {
    var customKeys = document.querySelectorAll('.custom-keys')
    customKeys.forEach(function (customKey, index) {
      customKey.setAttribute('data-show-key', 'yes')
    })
  } else if (selectedGroup.textContent === 'All') {
    var allKeys = document.querySelectorAll('.all-keys')
    allKeys.forEach(function (allKey, index) {
      allKey.setAttribute('data-show-key', 'yes')
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
function selectGroupButtonClick (event) {
  resetFilter()
  resetButtons()
  var selectedGroup = event.target
  selectedGroup.className = 'selected'
  showGroup(selectedGroup)
}
function selectAllGroup () {
  resetButtons()
  var allGroupButtons = document.querySelectorAll('.group-buttons ul li')
  for (var i = 0; i < allGroupButtons.length; i++) {
    allGroupButtons[i].className = ''
  }
  var firstGroup = document.querySelectorAll('.group-buttons ul li')[0]
  firstGroup.className = 'selected'
}
function resetFilter () {
  var searchInput = document.querySelector('.search-input')
  var allKeys = document.querySelectorAll('.all-keys')
  for (var j = 0; j < allKeys.length; j++) {
    allKeys[j].setAttribute('data-show-key', 'no')
  }
  searchInput.value = ''
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
      'keymap-display:change-groups': () => this.changeGroups(),
      'keymap-display:search': () => this.search()
    }))
    var buttons = document.querySelectorAll('.group-buttons ul li')
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', selectGroupButtonClick, false)
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
      resetFilter()
      // shifts between buttons on alt-j.
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

    var searchInput = document.querySelector('.search-input')
    var allKeys = document.querySelectorAll('.all-keys')
    searchInput.addEventListener('input', function (event) {
      selectAllGroup()
      showGroup(document.querySelectorAll('.group-buttons ul li')[0])
      for (var j = 0; j < allKeys.length; j++) {
        allKeys[j].setAttribute('data-show-key', 'no')
      }
      // If there are search terms separated by spaces.
      if (searchInput.value.indexOf(' ') !== -1) {
        // console.log('contains spaces')
        var searchTerms = searchInput.value.split(' ')
        for (var i = 0; i < allKeys.length; i++) {
          for (var k = 0; k < searchTerms.length; k++) {
            if (allKeys[i].firstChild.firstChild.textContent.indexOf(searchTerms[k]) !== -1) {
              allKeys[i].setAttribute('data-show-key', 'yes')
            }
          }
        }
      } else {
        for (var m = 0; m < allKeys.length; m++) {
          if (allKeys[m].firstChild.firstChild.textContent.indexOf(searchInput.value) !== -1) {
            allKeys[m].setAttribute('data-show-key', 'yes')
          }
        }
      }
    }, false)

    // if modal open do this
    if (document.querySelector('atom-panel-container.modal').getAttribute('data-keymap-display') === 'open') {
      // Set to default max-width restriction.
      document.querySelector('atom-panel-container.modal').removeAttribute('data-keymap-display')
    } else {
      /* If modal closed do this: remove default max-width
      restriction and modal width should be 100% of window. */
      document.querySelector('atom-panel-container.modal').setAttribute('data-keymap-display', 'open')
    }
    return (
      this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
      // this.modalPanel.show()
    )
  },
  search () {
    var searchInput = document.querySelector('.search-input')
    searchInput.focus()
  }
}
