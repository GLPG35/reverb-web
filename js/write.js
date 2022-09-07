import { addMusic, addNote, getMusic, newMusic, deleteMusic } from './firebase/client.js'
import { getDownloadURL } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js"

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
const musicButton = document.querySelector('.sidebar .music')
const musicPlayer = document.querySelector('.musicPlayer')
const floatingPlayer = document.querySelector('.floatingPlayer')
const disc = document.querySelector('.musicPlayer .fa-compact-disc')
const disc2 = document.querySelector('.floatingPlayer .fa-compact-disc')
const themeName = document.querySelector('.musicPlayer .themeName')
const themeName2 = document.querySelector('.floatingPlayer .themeName span')
const playButton = document.querySelector('.musicPlayer .play')
const playButton2 = document.querySelector('.floatingPlayer .play')
const prevButton = document.querySelector('.musicPlayer .prev')
const prevButton2 = document.querySelector('.floatingPlayer .prev')
const nextButton = document.querySelector('.musicPlayer .next')
const nextButton2 = document.querySelector('.floatingPlayer .next')
const musicList = document.querySelector('.musicPlayer .musicList .list')
const musicQuantity = document.querySelector('.musicPlayer .quantity')
const uploadTrack = document.querySelector('.musicPlayer .uploadTrack')
const uploadTrackInput = document.querySelector('.musicPlayer input')
const volumeIndicator = document.querySelector('.volumeIndicator')
let volTimer
const uid = localStorage.getItem('uid') ? localStorage.getItem('uid') :
    (localStorage.setItem('uid', Date.now()), localStorage.getItem('uid'))

const checkNotes = () => {
    const tabs = document.querySelector('.container1 .tabs')
    const notesList = JSON.parse(localStorage.getItem('notes')) ||
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

    toggleViewIcon.classList.contains('fa-pen') && toggleView()

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
    const newOpenNotes = JSON.parse(localStorage.getItem('openNotes'))

    newOpenNotes.splice(noteIndex, 1)
    localStorage.setItem('openNotes', JSON.stringify(newOpenNotes))

    checkTabs()
}

const changeTab = (titleID) => {
    const notes = JSON.parse(localStorage.getItem('notes'))
    const noteIndex = notes.findIndex(x => x.title == titleID)
    const openNotesList = JSON.parse(localStorage.getItem('openNotes'))
    
    const newOpenNotes = openNotesList.map(x => {
        if (x.title == titleID) {
            return {
                ...x,
                active: true
            }
        } else {
            return {
                ...x,
                active: false
            }
        }
    })

    localStorage.setItem('openNotes', JSON.stringify(newOpenNotes))

    textarea.value = (notes[noteIndex].content)
    previewText(notes[noteIndex].content)

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

const saveDocument = (e) => {
    if (e.ctrlKey && e.keyCode == 83) {
        e.preventDefault()
    } else if (e.keyCode == 27) {
        closeMenu()
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
    textarea.focus()
}

const toggleFloating = () => {
    floatingPlayer.classList.toggle('active')
}

const togglePlay = () => {
    const audio = document.querySelector('audio')

    if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
        document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
        document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
        document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
        document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
        disc.style.animationPlayState = 'running'
        disc2.style.animationPlayState = 'running'

        audio.src && audio.play()
    } else {
        document.querySelector('.musicPlayer .play i').classList.add('fa-play')
        document.querySelector('.musicPlayer .play i').classList.remove('fa-pause')
        document.querySelector('.floatingPlayer .play i').classList.add('fa-play')
        document.querySelector('.floatingPlayer .play i').classList.remove('fa-pause')
        disc.style.animationPlayState = 'paused'
        disc2.style.animationPlayState = 'paused'

        audio.src && audio.pause()
    }

    document.querySelector('.musicPlayer .controls').classList.toggle('active')
}

const prevSong = () => {
    const audio = document.querySelector('audio')
    const musicList = JSON.parse(localStorage.getItem('music')) || []
    const currentIndex = musicList.findIndex(x => x.playing == true)
    
    if (currentIndex == 0) {
        const newMusicList = musicList.map(x => {
            if (x.playing == true) {
                return {
                    ...x,
                    playing: false
                }
            } else if (x.id == musicList[musicList.length - 1].id) {
                return {
                    ...x,
                    playing: true
                }
            } else {
                return x
            }
        })

        localStorage.setItem('music', JSON.stringify(newMusicList))

        audio.src = musicList[musicList.length - 1].url
        themeName.innerHTML = musicList[musicList.length - 1].title
        themeName2.innerHTML = musicList[musicList.length - 1].title
        
        if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
            document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
            document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
            document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
            document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
            disc.style.animationPlayState = 'running'
            disc2.style.animationPlayState = 'running'

            audio.src && audio.play()

            document.querySelector('.musicPlayer .controls').classList.add('active')
        } else {
            audio.play()
        }
    } else {
        const newMusicList = musicList.map(x => {
            if (x.playing == true) {
                return {
                    ...x,
                    playing: false
                }
            } else if (x.id == musicList[currentIndex - 1].id) {
                return {
                    ...x,
                    playing: true
                }
            } else {
                return x
            }
        })

        localStorage.setItem('music', JSON.stringify(newMusicList))
        
        audio.src = musicList[currentIndex - 1].url
        themeName.innerHTML = musicList[currentIndex - 1].title
        themeName2.innerHTML = musicList[currentIndex - 1].title

        if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
            document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
            document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
            document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
            document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
            disc.style.animationPlayState = 'running'
            disc2.style.animationPlayState = 'running'

            audio.src && audio.play()
            document.querySelector('.musicPlayer .controls').classList.add('active')
        } else {
            audio.play()
        }
    }
}

const nextSong = () => {
    const audio = document.querySelector('audio')
    const musicList = JSON.parse(localStorage.getItem('music')) || []
    const currentIndex = musicList.findIndex(x => x.playing == true)
    
    if (currentIndex == (musicList.length - 1)) {
        const newMusicList = musicList.map(x => {
            if (x.playing == true) {
                return {
                    ...x,
                    playing: false
                }
            } else if (x.id == musicList[0].id) {
                return {
                    ...x,
                    playing: true
                }
            } else {
                return x
            }
        })

        localStorage.setItem('music', JSON.stringify(newMusicList))

        audio.src = musicList[0].url
        themeName.innerHTML = musicList[0].title
        themeName2.innerHTML = musicList[0].title
        
        if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
            document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
            document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
            document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
            document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
            disc.style.animationPlayState = 'running'
            disc2.style.animationPlayState = 'running'

            audio.src && audio.play()

            document.querySelector('.musicPlayer .controls').classList.add('active')
        } else {
            audio.play()
        }
    } else {
        const newMusicList = musicList.map(x => {
            if (x.playing == true) {
                return {
                    ...x,
                    playing: false
                }
            } else if (x.id == musicList[currentIndex + 1].id) {
                return {
                    ...x,
                    playing: true
                }
            } else {
                return x
            }
        })

        localStorage.setItem('music', JSON.stringify(newMusicList))
        
        audio.src = musicList[currentIndex + 1].url
        themeName.innerHTML = musicList[currentIndex + 1].title
        themeName2.innerHTML = musicList[currentIndex + 1].title

        if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
            document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
            document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
            document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
            document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
            disc.style.animationPlayState = 'running'
            disc2.style.animationPlayState = 'running'

            audio.src && audio.play()
            document.querySelector('.musicPlayer .controls').classList.add('active')
        } else {
            audio.play()
        }
    }
}

const viewMusic = () => {
    if (folder.classList.contains('active')) viewFolder()
    if (addNoteButton.classList.contains('active')) return
    if (musicPlayer.classList.contains('active')) {
        volumeIndicator.classList.remove('menuOpen')
    } else {
        volumeIndicator.classList.add('menuOpen')
    }

    toggleFloating()
    musicPlayer.classList.toggle('active')
}

const playTrack = (id) => {
    const musicList = JSON.parse(localStorage.getItem('music'))
    const findPlaying = musicList.find(x => x.playing == true)
    const songToPlay = musicList.find(x => x.id == id)

    if (findPlaying) {
        if (findPlaying.id == songToPlay.id) {
            const newMusicList = musicList.map(x => {
                if (findPlaying.id == x.id) {
                    return {
                        ...x,
                        playing: true
                    }
                } else {
                    return {
                        ...x,
                        playing: false
                    }
                }
            })
    
            localStorage.setItem('music', JSON.stringify(newMusicList))
        } else {
            const newMusicList = musicList.map(x => {
                if (songToPlay.id == x.id) {
                    return {
                        ...x,
                        playing: true
                    }
                } else {
                    return {
                        ...x,
                        playing: false
                    }
                }
            })
    
            localStorage.setItem('music', JSON.stringify(newMusicList))
        }
        
    } else {
        const newMusicList = musicList.map(x => x.id == id ? {...x, playing: true} : x)
        localStorage.setItem('music', JSON.stringify(newMusicList))
    }

    const audio = document.querySelector('audio')

    audio.src = songToPlay.url
    themeName.innerHTML = songToPlay.title
    themeName2.innerHTML = songToPlay.title
    audio.play()
    
    if (!document.querySelector('.musicPlayer .controls').classList.contains('active')) {
        document.querySelector('.musicPlayer .play i').classList.remove('fa-play')
        document.querySelector('.musicPlayer .play i').classList.add('fa-pause')
        document.querySelector('.floatingPlayer .play i').classList.remove('fa-play')
        document.querySelector('.floatingPlayer .play i').classList.add('fa-pause')
        disc.style.animationPlayState = 'running'
        disc2.style.animationPlayState = 'running'

        document.querySelector('.musicPlayer .controls').classList.add('active')
    }
}

const changeDiscVol = (e) => {
    const currentAudio = document.querySelector('audio')

    if (e.deltaY < 0) {
        currentAudio.volume = currentAudio.volume != 1.0 ? Math.round((currentAudio.volume + 0.01) * 100) / 100 : 1
    } else {
        currentAudio.volume = currentAudio.volume != 0.0 ? Math.round((currentAudio.volume - 0.01) * 100) / 100 : 0
    }

    showVolume()
}

const showVolume = () => {
    const currentVolume = document.querySelector('audio').volume
    const volumeIcon = volumeIndicator.querySelector('i')
    !volumeIndicator.classList.contains('active') && volumeIndicator.classList.add('active')
    volumeIndicator.querySelector('.progress').style.width = `${currentVolume * 100}%`

    if ((currentVolume * 100) == 0) {
        volumeIcon.removeAttribute('class')
        volumeIcon.setAttribute('class', 'fas fa-volume-xmark')
    } else if ((currentVolume * 100) > 0 && (currentVolume * 100) < 50) {
        volumeIcon.removeAttribute('class')
        volumeIcon.setAttribute('class', 'fas fa-volume-low')
    } else if ((currentVolume * 100) >= 50) {
        volumeIcon.removeAttribute('class')
        volumeIcon.setAttribute('class', 'fas fa-volume-high')
    }
    
    clearTimeout(volTimer)

    volTimer = setTimeout(() => {
        volumeIndicator.classList.remove('active')
    }, 1000)
}

const listMusic = () => {
    const list = JSON.parse(localStorage.getItem('music')) || []
    const currentAudio = document.querySelector('audio')

    musicList.innerHTML = ''
    musicList.insertAdjacentHTML('afterbegin',
        `<div class="spinnerContainer">
            <div class="spinnerWrapper">
                <div class="spinner"></div>
            </div>
        </div>`
    )

    musicQuantity.innerHTML = `${list.length} of 20`

    if (!list.length) {
        musicList.insertAdjacentHTML('beforeend',
            `<div class="noTracks">
                <i class="fas fa-heart-circle-xmark"></i>
                <span>You don't have music yet!</span>
            </div>`
        )

        return
    }

    let counter = 1

    list.forEach(({id, title, url}) => {
        if (counter == 1) {
            const isPlaying = list.find(x => x.playing == true)
            !document.querySelector('.musicPlayer .controls').classList.contains('active') &&
                (currentAudio.volume = 0.1)
            
            if (!isPlaying) {
                const newMusicList = list.map(x => x.id == id ? {...x, playing: true} : x)
                localStorage.setItem('music', JSON.stringify(newMusicList))

                currentAudio.src = url
                themeName.innerHTML = title
                themeName2.innerHTML = title

                document.querySelector('.musicPlayer .controls').classList.contains('active') &&
                    togglePlay()
            } else {
                if (document.querySelector('.musicPlayer .controls').classList.contains('active')) {
                    playTrack(isPlaying.id)
                } else {
                    currentAudio.src = isPlaying.url
                    themeName.innerHTML = isPlaying.title
                    themeName2.innerHTML = isPlaying.title
                }
            }
        }

        musicList.insertAdjacentHTML('beforeend',
            `<div class="item" title=${title} id=${id}>
                <div class="trackInfo">
                    <span class="trackNumber">${counter}.</span>
                    <span class="trackTitle">${title}</span>
                </div>
                <div class="delete" title="${id}">
                    <i class="fas fa-trash"></i>
                </div>
            </div>`
        )

        document.querySelector(`.musicList .list .item[id="${id}"]`)
            .addEventListener('click', () => playTrack(id))
        document.querySelector(`.item .delete[title="${id}"]`)
            .addEventListener('click', (e) => {e.stopPropagation(), confirmDeleteTrack(id)})

        counter++
    })
}

listMusic()

const deleteTrack = (id) => {
    const musicSpinner = document.querySelector('.musicPlayer .list .spinnerContainer')
    const list = JSON.parse(localStorage.getItem('music'))

    uploadTrack.setAttribute('disabled', '')
    musicSpinner.classList.add('active')

    deleteMusic(id).then(() => {
        const findPlaying = list.find(x => x.playing == true)

        getMusic(uid).then(data => {
            const musicList = data.map(x => {
                if (findPlaying.id == x.id) {
                    if (findPlaying.id == id) {
                        return false
                    }

                    return {
                        ...x,
                        playing: true
                    }
                } else {
                    return {
                        ...x,
                        playing: false
                    }
                }
            })

            localStorage.setItem('music', JSON.stringify(musicList))
            uploadTrack.removeAttribute('disabled')
            musicSpinner.classList.remove('active')
            listMusic()
        })
    })
}

const confirmDeleteTrack = (id) => {
    document.querySelector('.mainContainer').insertAdjacentHTML('afterbegin',
        `<div class="confirmDelete">
            <div class="modal">
                <div class="content">
                    <i class="fas fa-triangle-exclamation"></i>
                    <p>Are you sure to delete this track?</p>
                </div>
                <div class="buttons">
                    <button class="yes">Yes</button>
                    <button class="no">No</button>
                </div>
            </div>
        </div>`
    )

    const confirm = document.querySelector('.confirmDelete')

    confirm.addEventListener('click', () => {
        confirm.remove()
    })
    confirm.querySelector('.modal').addEventListener('click', (e) => e.stopPropagation())

    confirm.querySelector('.yes').addEventListener('click', () => {
        confirm.remove()
        deleteTrack(id)
    })
    confirm.querySelector('.no').addEventListener('click', () => {
        confirm.remove()
    })
}

const processTrack = (e) => {
    const musicSpinner = document.querySelector('.musicPlayer .list .spinnerContainer')
    const audioList = localStorage.getItem('music') ?
        JSON.parse(localStorage.getItem('music')) : []

    if (audioList.length == 20) return

    const audio = e.target.files[0]
    const extension = audio.name.split('.').pop()
    const title = audio.name.split(`.${extension}`).shift()
    const size = Number((audio.size / (1024 ** 2)).toFixed(2))
    const type = audio.type.match('audio.*')

    if (size > 5) {
        return
    } else if (!type) {
        return
    }

    const task = addMusic(audio, extension)

    task.on('state_changed',
        () => {
            uploadTrack.setAttribute('disabled', '')
            musicSpinner.classList.add('active')
        },
        (err) => {
            console.log(err)
        },
        () => {
            const reference = task.snapshot.ref._location.path_

            getDownloadURL(task.snapshot.ref)
            .then(url => {
                newMusic({uid, title, url, reference}).then(() => {
                    const findPlaying = audioList.find(x => x.playing == true)

                    getMusic(uid).then(data => {
                        const musicList = data.map(x => {
                            if (findPlaying?.id == x.id) {
                                return {
                                    ...x,
                                    playing: true
                                }
                            } else {
                                return {
                                    ...x,
                                    playing: false
                                }
                            }
                        })

                        localStorage.setItem('music', JSON.stringify(musicList))
                        uploadTrackInput.value = ''
                        uploadTrack.removeAttribute('disabled')
                        musicSpinner.classList.remove('active')
                        listMusic()
                    })
                })
            })
        }
    )
}

const viewFolder = () => {
    if (addNoteButton.classList.contains('active')) return
    if (document.querySelector('.tab.creating')) return
    if (musicPlayer.classList.contains('active')) viewMusic()

    if (folder.classList.contains('active')) {
        document.querySelector('.files i').classList.replace('fa-folder-open', 'fa-folder')
        volumeIndicator.classList.remove('menuOpen')
    } else {
        document.querySelector('.files i').classList.replace('fa-folder', 'fa-folder-open')
        volumeIndicator.classList.add('menuOpen')
    }

    folder.classList.toggle('active')
}

const closeMenu = () => {
    if (folder.classList.contains('active')) {
        folder.classList.toggle('active')
        document.querySelector('.files i').classList.replace('fa-folder-open', 'fa-folder')
        volumeIndicator.classList.remove('menuOpen')
    }
    if (musicPlayer.classList.contains('active')) {
        musicPlayer.classList.toggle('active')
        volumeIndicator.classList.remove('menuOpen')
        toggleFloating()
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
        const notes = JSON.parse(localStorage.getItem('notes')) || []

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

            e.preventDefault()
            textarea.focus()
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
    if (folder.classList.contains('active')) viewFolder()
    if (musicPlayer.classList.contains('active')) viewMusic()
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
document.querySelector('.container1').addEventListener('click', closeMenu)
textarea.addEventListener('input', () => {previewText(textarea.value), autoSave()})
newNote.addEventListener('click', newFolderNote)
addNoteTab.addEventListener('click', newTabNote)
addGuideNote.addEventListener('click', () => addNoteTab.click())
closeWelcome && closeWelcome.addEventListener('click', removeWelcome)
musicButton.addEventListener('click', viewMusic)
playButton.addEventListener('click', togglePlay)
playButton2.addEventListener('click', togglePlay)
prevButton.addEventListener('click', prevSong)
prevButton2.addEventListener('click', prevSong)
nextButton.addEventListener('click', nextSong)
nextButton2.addEventListener('click', nextSong)
uploadTrack.addEventListener('click', () => uploadTrackInput.click())
uploadTrackInput.addEventListener('change', processTrack)
document.querySelector('audio').addEventListener('ended', nextSong)
disc.addEventListener('wheel', changeDiscVol)
disc2.addEventListener('wheel', changeDiscVol)