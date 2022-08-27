import { addNote } from './firebase/client.js'

const toggleViewButton = document.querySelector('.toggleView')
let noWelcome = localStorage.getItem('noWelcome') ? localStorage.getItem('noWelcome') : false
let welcomeContent = localStorage.getItem('welcomeContent') ? localStorage.getItem('welcomeContent') : false

if (!noWelcome) {
    const tabs = document.querySelector('.container1 .tabs')

    tabs.insertAdjacentHTML('afterbegin', `
        <div id="40be4e59b9a2a2b5dffb918c0e86b3d7"
        class="welcomeTab active" title="Welcome to reverb!">
            <div class="icon">
                <i class="far fa-file"></i>
            </div>
            <div class="title">
                Welcome to reverb!
            </div>
            <div class="close">
                <i class="fas fa-times"></i>
            </div>
        </div>
    `)

    document.querySelector('.tabs .welcomeTab')
        .addEventListener('click', () => {
            textarea.value = welcomeContent
            previewText(textarea.value)

            document.querySelector(`.tabs .active`).classList.remove('active')
            document.querySelector(`.tabs .welcomeTab`).classList.add('active')
        })
    document.querySelector('.tabs .welcomeTab .close')
        .addEventListener('click', (e) => e.stopPropagation())
}

const textarea = document.querySelector('.document .textarea')
const preview = document.querySelector('.preview')
const toggleViewIcon = document.querySelector('.toggleView i')
const rDocument = document.querySelector('.document')
const viewFiles = document.querySelector('.files')
const addNoteButton = document.querySelector('.sidebar .add')
const addNoteInput = document.querySelector('.sidebar .add .newNote')
const addNoteClose = document.querySelector('.sidebar .add .newNote .close')
const addNoteSave = document.querySelector('.sidebar .add .newNote input')
const folder = document.querySelector('.folder')
const folderList = document.querySelector('.folder .list')
const closeWelcome = document.querySelector('.container1 .tabs .close')
const newNote = document.querySelector('.folder .newNote')
const addNoteTab = document.querySelector('header .addTab')
const addGuideNote = document.querySelector('.guide .addNote')
const uid = localStorage.getItem('uid') ? localStorage.getItem('uid') :
    (localStorage.setItem('uid', Date.now()), localStorage.getItem('uid'))

const checkNotes = () => {
    const tabs = document.querySelector('.container1 .tabs')
    const notesList = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) :
        (localStorage.setItem('notes', JSON.stringify([])), [])
    const openNotes = localStorage.getItem('openNotes') ? JSON.parse(localStorage.getItem('openNotes')) :
        (localStorage.setItem('openNotes', JSON.stringify([])), [])

    if (!notesList.length) {
        const lastChild = folderList.lastElementChild

        lastChild && folderList.children.length &&
            folderList.removeChild(lastChild)

        folderList.classList.add('empty')
        folderList.insertAdjacentHTML('afterend',
            `<div class="noNotes">
                <i class="fas fa-file-circle-xmark"></i>
                <span>You don't have any notes yet!</span>
            </div>`
        )
    } else {
        folderList.classList.remove('empty')

        document.querySelector('.folder .noNotes') &&
            document.querySelector('.folder .noNotes').remove()

        folderList.innerHTML = ''

        notesList.map(({title}) => {
            folderList.insertAdjacentHTML('beforeend',
                `<div class="item" title="${title}">
                    <i class="fas fa-note-sticky"></i>
                    <span>
                        ${title}
                    </span>
                    <div class="delete">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>`
            )

            document.querySelector(`.folder .list .item[title="${title}"]`)
                .addEventListener('click', () => addTab(title))
            document.querySelector(`.folder .list .item[title="${title}"] .delete`)
                .addEventListener('click', (e) => {e.stopPropagation(), confirmDelete(title)})
        })

        openNotes.map(({title}) => {
            if (!document.querySelector(`.tabs .tab[title="${title}"]`)) {
                tabs.insertAdjacentHTML('beforeend',
                    `<div id="${title}"
                    class="tab" title="${title}">
                        <div class="icon">
                            <i class="far fa-file"></i>
                        </div>
                        <div class="title">
                            ${title}
                        </div>
                        <div title=${title} class="close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>`
                )

                document.querySelector(`.tabs .tab[title="${title}"] .close`)
                    .addEventListener('click', (e) => {e.stopPropagation(), closeTab(title)})
                document.querySelector(`.tabs .tab[title="${title}"]`)
                    .addEventListener('click', () => changeTab(title))
            }
        })
    }
}

checkNotes()

const checkTabs = () => {
    const tabs = document.querySelector('.container1 .tabs')
    const notes = JSON.parse(localStorage.getItem('notes'))
    const openTabs = document.querySelectorAll('.tabs .tab')
    const openNotes = JSON.parse(localStorage.getItem('openNotes'))
    const guide = document.querySelector('.guide')

    if (document.querySelector('.tabs .creating')) return

    openTabs.forEach(({id}) => {
        if (!notes.find(x => x.title == id)) {
            document.querySelector(`.tabs .tab[title="${id}"]`).remove()

            if (openNotes.find(x => x.title == id)) {
                const openIndex = openNotes.findIndex(x => x.title == id)

                openNotes.splice(openIndex, 1)
                localStorage.setItem('openNotes', JSON.stringify(openNotes))
            }
        }
    })

    if (!tabs.children.length) {
        document.querySelector('header').classList.add('noTabs')
        guide.classList.add('active')
        
        if (toggleViewIcon.classList.contains('fa-floppy-disk')) {
            toggleViewButton.click()
        }

        toggleViewButton.classList.add('hidden')
    } else {
        toggleViewButton.classList.remove('hidden')

        if (document.querySelector('header').classList.contains('noTabs')) {
            document.querySelector('header').classList.remove('noTabs')
        }

        if (guide.classList.contains('active')) {
            guide.classList.remove('active')
        }
    }
}

checkTabs()

const addTab = (titleID) => {
    const tabs = document.querySelector('.container1 .tabs')
    if (document.querySelector(`.tabs .tab[title="${titleID}"]`)) return

    tabs.insertAdjacentHTML('beforeend',
        `<div id="${titleID}"
        class="tab" title="${titleID}">
            <div class="icon">
                <i class="far fa-file"></i>
            </div>
            <div class="title">
                ${titleID}
            </div>
            <div class="close">
                <i class="fas fa-times"></i>
            </div>
        </div>`
    )

    document.querySelector(`.tabs .tab[title="${titleID}"] .close`)
        .addEventListener('click', (e) => {e.stopPropagation(), closeTab(titleID)})
    document.querySelector(`.tabs .tab[title="${titleID}"]`)
        .addEventListener('click', () => changeTab(titleID))

    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    const newTab = {
        title: titleID,
        active: true
    }

    openNotesList.push(newTab)
    localStorage.setItem('openNotes', JSON.stringify(openNotesList))

    changeTab(titleID)

    toggleViewIcon.classList.contains('fa-pen') && toggleViewButton.click()
    textarea.focus()

    checkTabs()
}

const closeTab = (titleID) => {
    const isCurrentTab = document.querySelector(`.tabs .tab.active[title="${titleID}"]`)
    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    const currentIndex = openNotesList.findIndex(x => x.title == titleID)
    const nextTab = openNotesList[currentIndex + 1] ?
        openNotesList.slice(currentIndex + 1) : openNotesList.slice(currentIndex - 1)
    const openTabs = document.querySelectorAll('.tabs .tab').length

    if (openTabs == 1 && !noWelcome) {
        textarea.value = welcomeContent
        previewText(textarea.value)

        document.querySelector('.tabs .welcomeTab').classList.add('active')
    } else if (isCurrentTab) {
        changeTab(nextTab[0].title)

        if (openTabs == 1) {
            textarea.value = ''
            previewText(textarea.value)
        }
    }
    
    document.querySelector(`.tabs .tab[title="${titleID}"]`).remove()
    const noteIndex = openNotesList.findIndex(x => x.title == titleID)

    openNotesList.splice(noteIndex, 1)
    localStorage.setItem('openNotes', JSON.stringify(openNotesList))

    checkTabs()
}

const changeTab = (titleID) => {
    const notes = JSON.parse(localStorage.getItem('notes'))
    const noteIndex = notes.findIndex(x => x.title == titleID)
    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    
    const newOpenNotes = openNotesList.map(({title, active}) => {
        return {
            title,
            ...(title == titleID && active == true ? {active: true} :
                active == true ? {active: false} :
                title == titleID ? {active: true} :
                {active: false})
        }
    })

    localStorage.setItem('openNotes', JSON.stringify(newOpenNotes))

    textarea.value = (notes[noteIndex].content)
    previewText(notes[noteIndex].content)
    textarea.focus()

    document.querySelector('.tabs .active') && document.querySelector(`.tabs .active`).classList.remove('active')
    document.querySelector(`.tabs .tab[title="${titleID}"]`).classList.add('active')
}

const deleteFile = (titleID) => {
    const isCurrentTab = document.querySelector(`.tabs .tab.active[title="${titleID}"]`)
    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    const currentIndex = openNotesList.findIndex(x => x.title == titleID)
    const notes = JSON.parse(localStorage.getItem('notes'))
    const noteIndex = notes.findIndex(x => x.title == titleID)
    const nextTab = openNotesList[currentIndex + 1] ?
        openNotesList.slice(currentIndex + 1) : openNotesList.slice(currentIndex - 1)
    const openTabs = document.querySelectorAll('.tabs .tab').length

    if (openTabs == 1 && !noWelcome) {
        textarea.value = welcomeContent
        previewText(textarea.value)

        document.querySelector('.tabs .welcomeTab').classList.add('active')
    } else if (isCurrentTab) {
        changeTab(nextTab[0].title)

        if (openTabs == 1) {
            textarea.value = ''
            previewText(textarea.value)
        }
    }

    notes.splice(noteIndex, 1)
    localStorage.setItem('notes', JSON.stringify(notes))

    checkNotes()
    checkTabs()
}

const confirmDelete = (titleID) => {
    document.querySelector('.mainContainer').insertAdjacentHTML('afterbegin',
        `<div class="confirmDelete">
            <div class="modal">
                <div class="content">
                    <i class="fas fa-triangle-exclamation"></i>
                    <p>Are you sure to delete this file?</p>
                </div>
                <div class="buttons">
                    <button class="yes">Yes</button>
                    <button class="no">No</button>
                </div>
            </div>
        </div>`
    )

    const confirmDelete = document.querySelector('.confirmDelete')

    confirmDelete.addEventListener('click', () => {
        confirmDelete.remove()
    })
    document.querySelector('.confirmDelete .modal').addEventListener('click', (e) => e.stopPropagation())
    document.querySelector('.confirmDelete .yes').addEventListener('click', () => {
        deleteFile(titleID)
        confirmDelete.remove()
    })
    document.querySelector('.confirmDelete .no').addEventListener('click', () => {
        confirmDelete.remove()
    })
}

const keyWords = [
    {
        rule: /<(http:\/\/|https:\/\/)(.*)>/gim,
        parse: '<a href="$1$2">$1$2</a>'
    },
    {
        rule: /<(.*)@(.*)>/gim,
        parse: '<a href="mailto:$1@$2">$1@$2</a>'
    },
    {
        rule: /^# (.*$)/gim,
        parse: '<h1>$1</h1>'
    },
    {
        rule: /^## (.*$)/gim,
        parse: '<h2>$1</h2>'
    },
    {
        rule: /^### (.*$)/gim,
        parse: '<h3>$1</h3>'
    },
    {
        rule: /^#### (.*$)/gim,
        parse: '<h4>$1</h4>'
    },
    {
        rule: /^##### (.*$)/gim,
        parse: '<h5>$1</h5>'
    },
    {
        rule: /^###### (.*$)/gim,
        parse: '<h6>$1</h6>'
    },
    {
        rule: /^(.+)\n\={3,}/gim,
        parse: '<h1>$1</h1>\n<hr>'
    },
    {
        rule: /^(.+)\n\-{3,}/gim,
        parse: '<h2>$1</h2>\n<hr>'
    },
    {
        rule: /^(?!.+)\n\={3,}/gim,
        parse: '\n<hr>'
    },
    {
        rule: /^(?!.+)\n\-{3,}/gim,
        parse: '\n<hr>'
    },
    {
        rule: /\*\*(.*)\*\*/gim,
        parse: '<b>$1</b>'
    },
    {
        rule: /__(.*)__/gim,
        parse: '<b>$1</b>'
    },
    {
        rule: /\*(.*)\*/gim,
        parse: '<em>$1</em>'
    },
    {
        rule: /\b(?![https:\/\/|http:\/\/])_(.*)_/gim,
        parse: '<em>$1</em>'
    },
    {
        rule: /^> (.*)/gim,
        parse: '<blockquote>$1</blockquote>'
    },
    {
        rule: /^ *\n\*/gim,
        parse: '<ul>\n*'
    },
    {
        rule: /^(\*.+) *\n([^\*])/gim,
        parse: '$1</ul>$2'
    },
    {
        rule: /^\* (.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /^ *\n-/gim,
        parse: '<ul>\n-'
    },
    {
        rule: /^(-.+) *\n([^-])/gim,
        parse: '$1</ul>$2'
    },
    {
        rule: /^- (.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /^ *\n\d+\. /gim,
        parse: '<ol>\n1.'
    },
    {
        rule: /^(\d\..+) *\n([^\d\.])/gim,
        parse: '$1</ol>$2'
    },
    {
        rule: /^\d\.(.+)/gim,
        parse: '<li>$1</li>'
    },
    {
        rule: /\!\[([^\]]+)\]\(([^\)]+)\)/gim,
        parse: '<img src="$2" alt="$1" />'
    },
    {
        rule: /\[([^\]]+)\]\(([^\)]+)\)/gim,
        parse: '<a href="$2">$1</a>'
    },
    {
        rule: /\`(.*)\`/gim,
        parse: '<code>$1</code>'
    },
    {
        rule: /\n/gim,
        parse: '<br>'
    }
]

const keyWords2 = [
    {
        rule: /<\/h1><br>/gim,
        parse: '</h1>'
    },
    {
        rule: /<\/h2><br>/gim,
        parse: '</h2>'
    },
    {
        rule: /<\/h3><br>/gim,
        parse: '</h3>'
    },
    {
        rule: /<\/h4><br>/gim,
        parse: '</h4>'
    },
    {
        rule: /<\/h5><br>/gim,
        parse: '</h5>'
    },
    {
        rule: /<\/h6><br>/gim,
        parse: '</h6>'
    },
    {
        rule: /<hr><br>/gim,
        parse: '<hr>'
    },
    {
        rule: /<\/li><br><li>/gim,
        parse: '</li><li>'
    }
]

const saveDocument = (e) => {
    if (e.ctrlKey && e.keyCode == 83) {
        e.preventDefault()
    }
}

const markdownParser = (text) => {
    let parsedText = text

    keyWords.map(({rule, parse}) => {
        parsedText = parsedText.replace(rule, parse)
    })

    keyWords2.map(({rule, parse}) => {
        parsedText = parsedText.replace(rule, parse)
    })

    return parsedText.trim()
}

const previewText = (text) => {
    const parsedText = markdownParser(text)

    preview.innerHTML = parsedText
}

const toggleView = () => {
    if (!rDocument.classList.contains('active')) {
        toggleViewIcon.classList.remove('fa-pen')
        toggleViewIcon.classList.add('fa-floppy-disk')
    } else {
        toggleViewIcon.classList.remove('fa-floppy-disk')
        toggleViewIcon.classList.add('fa-pen')
    }

    rDocument.classList.toggle('active')
}

const viewFolder = () => {
    if (addNoteButton.classList.contains('active')) return
    if (document.querySelector('.tab.creating')) return

    folder.classList.contains('active') ?
        document.querySelector('.files i').classList.replace('fa-folder-open', 'fa-folder') :
        document.querySelector('.files i').classList.replace('fa-folder', 'fa-folder-open')

    folder.classList.toggle('active')
}

const closeFolder = () => {
    if (folder.classList.contains('active')) {
        folder.classList.toggle('active')
        document.querySelector('.files i').classList.replace('fa-folder-open', 'fa-folder')
    }
}

if (!noWelcome && !welcomeContent) {
    fetch('../js/resources/welcomeText').then(res => res.text())
    .then(text => {
        textarea.value = text
        previewText(textarea.value)
        localStorage.setItem('welcomeContent', text)
        welcomeContent = text
    })
} else if (!noWelcome && welcomeContent) {
    textarea.value = welcomeContent
    previewText(textarea.value)
} else {
    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    const isEmpty = openNotesList.length ? false : true
    
    if (!isEmpty) {
        const lastTab = openNotesList.findIndex(x => x.active == true)
        const tabTitle = openNotesList[lastTab].title
        
        changeTab(tabTitle)
    }
}

const createFile = (e) => {
    const inputClass = e.target.classList.value
    let type

    switch (inputClass) {
        case 'inputButton':
            document.querySelector('.sidebar .add .newNote .input').classList.contains('error') &&
                document.querySelector('.sidebar .add .newNote .input').classList.remove('error')
            type = 'button'
            break
        case 'noteTitle':
            document.querySelector('.folder .inputTitle .input').classList.contains('error') &&
                document.querySelector('.folder .inputTitle .input').classList.remove('error')
            type = 'folder'
            break
        case 'inputTab':
            document.querySelector('.tabs .tab.creating .input').classList.contains('error') &&
                document.querySelector('.tabs .tab.creating .input').classList.remove('error')
            type = 'tab'
            break
    }

    if (e.keyCode == 13) {
        const title = e.target.value
        let notes = JSON.parse(localStorage.getItem('notes'))

        const note = {
            uid,
            title,
            content: ''
        }

        const exist = notes.find(x => x.title == title)

        if (!exist) {
            notes.push(note)
            localStorage.setItem('notes', JSON.stringify(notes))

            closeInput(type)
            checkNotes()
            addTab(title)
            checkTabs()
        } else {
            switch (inputClass) {
                case 'inputButton':
                    document.querySelector('.sidebar .add .newNote .input').classList.add('error')
                    break
                case 'noteTitle':
                    document.querySelector('.folder .inputTitle .input').classList.add('error')
                    break
                case 'inputTab':
                    document.querySelector('.tabs .tab.creating .input').classList.add('error')
                    break
            }
        }
    }
}

const newFolderNote = () => {
    newNote.setAttribute('disabled', '')
    folder.classList.add('creating')
    document.querySelector('.folder .list').insertAdjacentHTML('afterend',
        `<div class="inputTitle">
            <i class="fas fa-note-sticky"></i>
            <div class="input">
                <input type="text" class="noteTitle">
                <div class="close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>`
    )
    document.querySelector('.folder .inputTitle input').focus()

    const closeNewNote = document.querySelector('.folder .inputTitle .close')
    closeNewNote.addEventListener('click', () => closeInput('folder'))
    document.querySelector('.folder .inputTitle input').addEventListener('keydown', createFile)
}

const newButtonNote = () => {
    if (folder.classList.contains('active')) return
    if (document.querySelector('.tab.creating')) return

    addNoteButton.classList.toggle('active')
    setTimeout(() => {
        addNoteSave.focus()
    }, 200)
}

const closeInput = (type) => {
    switch (type) {
        case 'button':
            addNoteButton.classList.toggle('active')
            addNoteSave.value = ''
            break
        case 'folder':
            newNote.removeAttribute('disabled')
            folder.classList.remove('creating')
            document.querySelector('.folder .inputTitle').remove()
            break
        case 'tab':
            document.querySelector('.tab.creating').remove()
            checkTabs()
            break
    }
    
}

const newTabNote = () => {
    const tabs = document.querySelector('.container1 .tabs')
    if (addNoteButton.classList.contains('active')) return
    if (document.querySelector('.tabs .tab.creating')) return
    
    tabs.insertAdjacentHTML('beforeend',
        `<div class="tab creating">
            <div class="icon">
                <i class="far fa-file"></i>
            </div>
            <div class="input">
                <input type="text" class="inputTab" />
                <div class="close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>`
    )

    if (!tabs.children.length) {
        document.querySelector('header').classList.add('noTabs')
    } else if (document.querySelector('header').classList.contains('noTabs')) {
            document.querySelector('header').classList.remove('noTabs')
    }

    document.querySelector('.tab.creating input').focus()

    document.querySelector('.tab.creating input')
        .addEventListener('keydown', createFile)
    document.querySelector('.tab.creating .close')
        .addEventListener('click', () => closeInput('tab'))
}

const removeWelcome = () => {
    localStorage.setItem('noWelcome', true)
    localStorage.removeItem('welcomeContent')
    noWelcome = true
    
    document.getElementById('40be4e59b9a2a2b5dffb918c0e86b3d7').remove()
    previewText('')
    textarea.value = ''

    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    const isEmpty = openNotesList.length ? false : true
    
    if (!isEmpty) {
        const lastTab = openNotesList.findIndex(x => x.active == true)
        const tabTitle = openNotesList[lastTab].title
        
        changeTab(tabTitle)
    }

    checkTabs()
}

const autoSave = () => {
    if (document.querySelector('.tabs .welcomeTab.active') || !document.querySelector('.tabs .tab')) return

    const currentTab = document.querySelector('.tabs .tab.active').title
    const notesList = JSON.parse(localStorage.getItem('notes'))
    const getNote = notesList.find(x => x.title == currentTab)
    const newContent = notesList.map(x => x.title == getNote.title ? {...x, content: textarea.value} : x)
    
    localStorage.setItem('notes', JSON.stringify(newContent))
}

autoSave()

document.addEventListener('keydown', saveDocument)
toggleViewButton.addEventListener('click', toggleView)
viewFiles.addEventListener('click', viewFolder)
addNoteButton.addEventListener('click', newButtonNote)
addNoteInput.addEventListener('click', (e) => e.stopPropagation())
addNoteSave.addEventListener('keydown', createFile)
addNoteClose.addEventListener('click', () => closeInput('button'))
document.querySelector('.container1').addEventListener('click', closeFolder)
textarea.addEventListener('input', () => {previewText(textarea.value), autoSave()})
newNote.addEventListener('click', newFolderNote)
addNoteTab.addEventListener('click', newTabNote)
addGuideNote.addEventListener('click', () => addNoteTab.click())
closeWelcome && closeWelcome.addEventListener('click', removeWelcome)