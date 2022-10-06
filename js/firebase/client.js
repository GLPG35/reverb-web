import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js"
import { getFirestore, collection, addDoc, getDocs,
    query, where, doc, deleteDoc, getDoc, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js"
import { getStorage, ref, uploadBytesResumable, deleteObject } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyDIddKsbkz8MpqQX3sIjtAozy6_UmlU7bQ",
    authDomain: "reverb-web-app.firebaseapp.com",
    projectId: "reverb-web-app",
    storageBucket: "reverb-web-app.appspot.com",
    messagingSenderId: "782158261364",
    appId: "1:782158261364:web:8d61d0530f47f4a3bcf521"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage()

export const addMusic = (audio, extension) => {
    const name = new Date().getTime().toString() + (Math.random() + 1).toString(36).substring(10)
    const refAudio = ref(storage, `music/${name}.${extension}`)
    const task = uploadBytesResumable(refAudio, audio)

    return task
}

export const newMusic = ({uid, title, url, reference}) => {
    return addDoc(collection(db, 'music'), {
        uid,
        title,
        url,
        reference,
        date: Timestamp.fromDate(new Date())
    })
}

const mapMusic = (doc) => {
    const data = doc.data()
    const id = doc.id

    return {
        ...data,
        id
    }
}

export const getMusic = (uid) => {
    return getDocs(query(collection(db, 'music'), where('uid', '==', uid), orderBy('date')))
    .then(({docs}) => {
        return docs.map(mapMusic)
    })
}

export const deleteMusic = (id) => {
    return getDoc(doc(db, 'music', id)).then(document => {
        const { reference } = document.data()

        return deleteDoc(doc(db, 'music', id)).then(() => {
            return deleteObject(ref(storage, reference))
        })
    })
}