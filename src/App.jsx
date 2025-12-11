import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';

import { 
  getAuth, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  onSnapshot, 
  collection, 
  query, 
  setDoc,
  addDoc,
  deleteDoc
} from 'firebase/firestore';


// --- Icon Component ---
const Icon = ({ name, className = "w-5 h-5", strokeWidth = 2 }) => {
    const icons = {
        Star: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        BookOpen: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2l10 5-10 5-10-5z"/></svg>,
        LogOut: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
        Home: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
        Settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.25a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.54a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.78 1.25a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.25a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.54a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.78-1.25a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
        Plus: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
        Search: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        Eye: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
        EyeOff: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.48-1.65"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
        Sun: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
        Moon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
        User: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
        PlayCircle: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>,
        ArrowLeft: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
        Trash: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    };
    return icons[name] || null;
};

// --- Config & Firebase Init ---
const globalScope = typeof window !== 'undefined' ? window : {};
const appId = globalScope.__app_id || 'default-app-id';
let parsedConfig = {};
const configString = globalScope.__firebase_config;
if (configString) {
    try { parsedConfig = JSON.parse(configString); } catch(e) { console.error(e); }
}
const firebaseConfig = parsedConfig;
const initialAuthToken = globalScope.__initial_auth_token || null;
const localFirebaseConfig = {
    apiKey: "AIzaSyBCrGsdbC1UbFm5usQayIcmXzEO9-Zk3kQ",
    authDomain: "isdproject-c9165.firebaseapp.com",
    projectId: "isdproject-c9165",
    storageBucket: "isdproject-c9165.firebasestorage.app",
    messagingSenderId: "863921155718",
    appId: "1:863921155718:web:0c3940de81211bde692b07",
    measurementId: "G-KM7DCVCJSF"
};

let app, auth, db, isFirebaseInitialized = false;
const finalConfig = firebaseConfig.projectId ? firebaseConfig : localFirebaseConfig;

if (finalConfig.projectId) { 
    try {
        app = initializeApp(finalConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        isFirebaseInitialized = true;
    } catch (error) { console.error(error); }
}

// --- Components ---

// NEW: Component for Navbar User Info (แยกออกมาเพื่อจัดการรูปโดยเฉพาะ)
const NavbarUser = ({ user, db, appId, onViewProfile }) => {
    const [avatar, setAvatar] = useState(user.photoURL || '');
    const [name, setName] = useState(user.displayName || 'Profile');

    // Listener: คอยฟังการเปลี่ยนแปลงของรูปโปรไฟล์ใน Database แบบ Real-time
    useEffect(() => {
        if (!user || !db) return;
        const unsub = onSnapshot(doc(db, `artifacts/${appId}/users/${user.uid}/profiles/data`), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.photoURL) setAvatar(data.photoURL);
                if (data.displayName) setName(data.displayName);
            }
        });
        return () => unsub();
    }, [user, db, appId]);

    return (
        <button 
            onClick={onViewProfile}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300 dark:border-gray-600 shadow-sm">
                <img src={avatar || "https://placehold.co/100?text=U"} alt="U" className="w-full h-full object-cover"/>
            </div>
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300 font-semibold">{name}</span>
        </button>
    );
};

const CourseCard = ({ course, onSelect }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-300 w-full sm:w-80 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
    <div className="h-40 bg-red-500 relative flex items-center justify-center text-white p-4" style={{ backgroundImage: `url(${course.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <span className={`absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 ${course.price === 0 ? 'bg-green-600' : 'bg-red-600'}`}>
            {course.price === 0 ? 'ฟรี' : `$${course.price.toFixed(2)}`}
        </span>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">{course.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden text-sm line-clamp-2">{course.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto mb-4">
        <div className="flex items-center space-x-1">
          <Icon name="Star" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">{course.rating.toFixed(1)}</span>
          <span>({course.numReviews})</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="BookOpen" />
          <span>{course.lessons.length} บทเรียน</span>
        </div>
      </div>
      <button 
        onClick={() => onSelect(course)}
        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-2 rounded-lg transition duration-150"
      >
        {course.price === 0 ? 'เข้าเรียนฟรี' : 'Start Learning'}
      </button>
    </div>
  </div>
);

const CourseDetail = ({ course, onBack }) => {
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const lessons = course.lessons && course.lessons.length > 0 ? course.lessons : [
        { title: "บทนำ: ภาพรวมของคอร์ส", duration: "05:00" },
        { title: "การเตรียมความพร้อมก่อนเริ่มเรียน", duration: "10:30" },
        { title: "เนื้อหาหลักส่วนที่ 1", duration: "15:45" },
        { title: "เนื้อหาหลักส่วนที่ 2", duration: "20:00" },
        { title: "บทสรุปและแบบทดสอบ", duration: "08:15" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={onBack} className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition font-medium">
                    <Icon name="ArrowLeft" className="mr-2 w-5 h-5"/>
                    กลับไปหน้ารวมคอร์ส
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition transform cursor-pointer shadow-lg border-2 border-white">
                                        <Icon name="PlayCircle" className="text-white w-8 h-8 ml-1" />
                                    </div>
                                    <p className="text-white font-medium drop-shadow-md">ตัวอย่างวิดีโอ</p>
                                </div>
                            </div>
                            <img src={course.image} alt="Cover" className="w-full h-full object-cover opacity-50" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${course.price === 0 ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300'}`}>
                                    {course.price === 0 ? 'คอร์สเรียนฟรี' : `$${course.price.toFixed(2)}`}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                {course.description}
                            </p>
                            
                            {course.pdfMaterial && (
                                <div className="mb-6">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center overflow-hidden w-full">
                                            <div className="bg-red-100 p-2 rounded-lg mr-3 flex-shrink-0">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">เอกสารประกอบการเรียน</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{course.pdfName || "CourseMaterial.pdf"}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button onClick={() => setShowPdfPreview(!showPdfPreview)} className="bg-blue-600 hover:bg-blue-700 text-white border border-transparent px-3 py-1.5 rounded text-sm font-medium transition flex items-center">
                                                <Icon name="Eye" className="w-4 h-4 mr-1"/> {showPdfPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง'}
                                            </button>
                                            <a href={course.pdfMaterial} download={course.pdfName || "CourseMaterial.pdf"} className="bg-white dark:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 px-3 py-1.5 rounded text-sm font-medium transition">ดาวน์โหลด</a>
                                        </div>
                                    </div>
                                    {showPdfPreview && (
                                        <div className="mt-4 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-inner h-[600px]">
                                            <embed src={course.pdfMaterial} type="application/pdf" width="100%" height="100%" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <div className="flex items-center">
                                    <Icon name="Star" className="text-yellow-400 mr-1"/>
                                    <span className="font-semibold text-gray-900 dark:text-white mr-1">{course.rating.toFixed(1)}</span>
                                    <span>({course.numReviews} รีวิว)</span>
                                </div>
                                <div className="flex items-center">
                                    <Icon name="BookOpen" className="text-red-500 mr-1"/>
                                    <span>{lessons.length} บทเรียน</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                                    <Icon name="BookOpen" className="mr-2 text-red-600 w-5 h-5"/> 
                                    เนื้อหาบทเรียน
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                                {lessons.map((lesson, index) => (
                                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer group">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">บทที่ {index + 1}</span>
                                            <span className="text-xs text-gray-400">{lesson.duration}</span>
                                        </div>
                                        <h4 className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {lesson.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl text-center">
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow transition">
                                    {course.price === 0 ? 'เข้าเรียนฟรี' : 'เริ่มเรียนทันที'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserProfile = ({ user, db, appId, onBack }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [photoURL, setPhotoURL] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, `artifacts/${appId}/users/${user.uid}/profiles/data`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.photoURL) setPhotoURL(data.photoURL);
                    if (data.displayName) setDisplayName(data.displayName);
                } else {
                    setPhotoURL(user.photoURL || '');
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, [user, db, appId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) {
                setMessage('ผิดพลาด: รูปภาพมีขนาดใหญ่เกินไป! (ต้องไม่เกิน 500KB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result);
                setMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await updateProfile(user, { displayName: displayName });
            await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profiles/data`), { 
                displayName: displayName,
                photoURL: photoURL, 
                email: user.email,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            setMessage('บันทึกข้อมูลสำเร็จเรียบร้อย!');
        } catch (error) {
            console.error(error);
            setMessage('เกิดข้อผิดพลาด: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-200">
            <div className="max-w-2xl mx-auto px-4">
                <button onClick={onBack} className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition">
                    <Icon name="ArrowLeft" className="mr-1 w-5 h-5"/> กลับหน้าหลัก
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-red-600 h-32 flex items-center justify-center">
                        <h1 className="text-3xl font-bold text-white">โปรไฟล์ของฉัน</h1>
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 overflow-hidden shadow-lg group">
                                <img src={photoURL || "https://placehold.co/400?text=User"} alt="Profile" className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                            </div>
                        </div>
                        {message && <div className={`mb-4 p-3 rounded-lg text-center text-sm ${message.includes('ผิดพลาด') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} className="hidden"/>
                            <div className="text-center">
                                <button type="button" onClick={() => document.getElementById('fileInput').click()} className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 bg-red-50 px-4 py-2 rounded-lg">เปลี่ยนรูปโปรไฟล์</button>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">รองรับไฟล์รูปภาพขนาดไม่เกิน 500KB</p>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อที่ใช้แสดง</label>
                                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400">อีเมล</label><div className="text-sm text-gray-700 dark:text-gray-300 truncate">{user.email}</div></div>
                                <div><label className="block text-xs font-medium text-gray-500 dark:text-gray-400">User ID</label><div className="text-xs text-gray-700 dark:text-gray-300 font-mono truncate">{user.uid}</div></div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition duration-200 disabled:bg-gray-400">{loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseList = ({ courses, userId, onCourseSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md p-6 mb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-4 sm:mb-0">Explore Our Top Courses</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">ยินดีต้อนรับสู่แหล่งเรียนรู้ออนไลน์ที่ดีที่สุด</div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-xl relative">
              <input type="text" placeholder="ค้นหาคอร์สเรียน..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-4 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-150" />
              <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          </div>
        </div>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => <CourseCard key={course.id} course={course} onSelect={onCourseSelect} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-inner border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-xl text-gray-600 dark:text-gray-300">ไม่พบคอร์สที่ค้นหา "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AddCourseForm = ({ db, appId, onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', description: '', price: 0, image: '' });
    const [pdfFile, setPdfFile] = useState(''); 
    const [pdfName, setPdfName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') { 
                setError('กรุณาเลือกเฉพาะไฟล์ PDF เท่านั้น'); 
                return; 
            }
            if (file.size > 950000) { 
                setError('ไฟล์ PDF ใหญ่เกินไป! (ต้องไม่เกิน 950KB เนื่องจากข้อจำกัดของ Database)'); 
                return; 
            }
            const reader = new FileReader();
            reader.onloadend = () => { 
                setPdfFile(reader.result); 
                setPdfName(file.name); 
                setError(null); 
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage(''); setError(null);
        if (!formData.title || !formData.description || !formData.image) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน'); setLoading(false); return;
        }
        if (formData.price < 0) {
            setError('ราคาต้องไม่ต่ำกว่า 0'); setLoading(false); return;
        }
        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/courses`), { ...formData, pdfMaterial: pdfFile, pdfName: pdfName, lessons: [], rating: 0.0, numReviews: 0, createdAt: new Date().toISOString() });
            setMessage(`เพิ่มคอร์ส "${formData.title}" เรียบร้อยแล้ว!`);
            setFormData({ title: '', description: '', price: 0, image: '' }); setPdfFile(''); setPdfName(''); onSuccess(); 
        } catch (err) { setError(`เกิดข้อผิดพลาด: ${err.message}`); } finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-2xl font-bold text-red-600 mb-6 border-b dark:border-gray-700 pb-2">Add New Course</h3>
            {message && <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>}
            {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อคอร์ส</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">รายละเอียด</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="3" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">เอกสารประกอบการเรียน (PDF)</label>
                <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                        <span>เลือกไฟล์ PDF</span>
                        <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                    </label>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{pdfName || "ยังไม่ได้เลือกไฟล์"}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">* ขนาดไม่เกิน 950KB (ข้อจำกัด Database)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ราคา ($)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ลิงก์รูปปก (URL)</label>
                    <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
            </div>
            <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
                {loading ? 'Adding...' : <><Icon name="Plus" className="mr-2 w-5 h-5"/> Add Course</>}
            </button>
        </form>
    );
};

const AdminDashboard = ({ courses, db, appId, userId, setView }) => {
    const handleDeleteCourse = async (courseId) => {
        if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบคอร์สนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
            try {
                await deleteDoc(doc(db, `artifacts/${appId}/public/data/courses`, courseId));
                alert("ลบคอร์สเรียบร้อยแล้ว");
            } catch (error) {
                console.error("Error removing document: ", error);
                alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-200">
            <header className="bg-red-600 shadow-md p-6 mb-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-white">
                    <h1 className="text-4xl font-extrabold mb-4 sm:mb-0">Admin Dashboard</h1>
                    <div className="flex items-center text-sm space-x-2 bg-red-700 p-2 rounded-lg">
                        <span className="font-medium">User ID:</span><span className="bg-red-800 p-1 rounded-lg font-mono text-xs break-all">{userId}</span>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-10 lg:w-3/4 xl:w-2/3 mx-auto">
                    <AddCourseForm db={db} appId={appId} onSuccess={() => setView('home')} />
                </div>
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Existing Courses ({courses.length})</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="relative p-4 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition duration-150">
                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 truncate pr-8">{course.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">${course.price.toFixed(2)}</p>
                                    <p className="text-xs text-red-500 break-all mb-2">ID: {course.id}</p>
                                    <button 
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        title="ลบคอร์ส"
                                    >
                                        <Icon name="Trash" className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthScreen = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) { setEmailError('กรุณากรอกอีเมล'); return false; } 
        else if (!re.test(email)) { setEmailError('รูปแบบอีเมลไม่ถูกต้อง'); return false; } 
        else { setEmailError(''); return true; }
    };

    const validatePassword = (pass) => {
        if (!pass) { setPasswordError('กรุณากรอกรหัสผ่าน'); return false; } 
        else if (pass.length < 6) { setPasswordError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return false; } 
        else { setPasswordError(''); return true; }
    };

    const handleEmailChange = (e) => { const val = e.target.value; setEmail(val); validateEmail(val); };
    const handlePasswordChange = (e) => { const val = e.target.value; setPassword(val); validatePassword(val); };

    const handleAuth = async (event) => {
        event.preventDefault(); setError(null);
        if (!validateEmail(email) || !validatePassword(password)) return;
        setLoading(true);
        try {
            if (rememberMe) localStorage.setItem('savedEmail', email); else localStorage.removeItem('savedEmail');
            const cred = isLogin 
                ? await signInWithEmailAndPassword(auth, email, password) 
                : await createUserWithEmailAndPassword(auth, email, password);
            if (!isLogin) await setDoc(doc(db, `artifacts/${appId}/users/${cred.user.uid}/profiles/data`), { email: cred.user.email, createdAt: new Date().toISOString() }, { merge: true });
            onLoginSuccess(cred.user);
        } catch (err) { 
            let msg = err.message;
            if (msg.includes('invalid-credential') || msg.includes('wrong-password')) msg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            else if (msg.includes('user-not-found')) msg = 'ไม่พบผู้ใช้งานนี้';
            else if (msg.includes('email-already-in-use')) msg = 'อีเมลนี้ถูกใช้งานไปแล้ว';
            setError(msg); 
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">{isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชีใหม่'}</h2>
                {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
                <form className="space-y-6" onSubmit={handleAuth}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อีเมล</label>
                        <input type="email" name="email" autoComplete="username" placeholder="name@example.com" value={email} onChange={handleEmailChange} className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors ${emailError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500'}`} />
                        {emailError && <p className="mt-1 text-sm text-red-500 animate-pulse">{emailError}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสผ่าน</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="อย่างน้อย 6 ตัวอักษร" value={password} onChange={handlePasswordChange} className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors pr-10 ${passwordError ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none">
                                {showPassword ? <Icon name="EyeOff" /> : <Icon name="Eye" />}
                            </button>
                        </div>
                        {passwordError && <p className="mt-1 text-sm text-red-500 animate-pulse">{passwordError}</p>}
                    </div>
                    {isLogin && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">จดจำอีเมลของฉัน</label>
                            </div>
                            <div className="text-sm">
                                <button type="button" onClick={() => alert("ระบบลืมรหัสผ่านยังไม่เปิดใช้งานในขณะนี้")} className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 bg-transparent border-none cursor-pointer p-0">ลืมรหัสผ่าน?</button>
                            </div>
                        </div>
                    )}
                    <button type="submit" disabled={loading || emailError || passwordError || !email || !password} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">{loading ? 'กำลังโหลด...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}</button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => { setIsLogin(!isLogin); setError(null); if(!rememberMe) setEmail(''); setPassword(''); setEmailError(''); setPasswordError(''); }} className="text-red-600 hover:text-red-500 font-medium text-sm">{isLogin ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentView, setCurrentView] = useState('home'); 
    const [selectedCourse, setSelectedCourse] = useState(null); 
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);
        setDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            if (newMode) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            return newMode;
        });
    };

    useEffect(() => {
        if (!isFirebaseInitialized) return;
        const initAuth = async () => { if (initialAuthToken) await signInWithCustomToken(auth, initialAuthToken).catch(e => console.error(e)); };
        const unsub = onAuthStateChanged(auth, user => { setCurrentUser(user); setAuthReady(true); });
        initAuth(); return () => unsub();
    }, []);

    useEffect(() => {
        if (!currentUser) { setCourses([]); setIsAdmin(false); return; }
        
        const isMyEmail = currentUser.email === '67319010062@technicrayong.ac.th';
        if (isMyEmail) {
            setIsAdmin(true);
            console.log("Force Admin: Open!");
        }

        const q = query(collection(db, `artifacts/${appId}/public/data/courses`));
        const unsubC = onSnapshot(q, snap => setCourses(snap.docs.map(d => ({ id: d.id, ...d.data(), lessons: d.data().lessons||[], image: d.data().image||'https://placehold.co/600x400' }))));
        
        const unsubA = onSnapshot(doc(db, `artifacts/${appId}/public/data/admin_roles`, currentUser.uid), snap => {
            const isDbAdmin = snap.exists() && snap.data().role === 'admin';
            const finalAdminStatus = isDbAdmin || isMyEmail;
            setIsAdmin(finalAdminStatus);
            if (!finalAdminStatus && currentView === 'admin') setCurrentView('home');
        }, (error) => {
            console.log("Database check failed, but keeping forced admin.");
        });

        return () => { unsubC(); unsubA(); };
    }, [currentUser, currentView]);

    const handleSignOut = () => {
        signOut(auth);
        setSelectedCourse(null);
        setCurrentView('home');
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        window.scrollTo(0, 0);
    };

    if (!isFirebaseInitialized) return <div className="p-10 text-center text-red-500">Firebase Config Error</div>;
    if (!authReady) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"><svg className="animate-spin h-10 w-10 text-red-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;
    if (!currentUser) return <AuthScreen onLoginSuccess={setCurrentUser} />;

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <nav className="fixed w-full bg-white dark:bg-gray-800 shadow-lg z-10 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => { setCurrentView('home'); setSelectedCourse(null); }}>
                             <span className="text-2xl font-extrabold text-red-600">Learnify</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={toggleDarkMode} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                                {darkMode ? <Icon name="Sun" className="w-5 h-5 text-yellow-400" /> : <Icon name="Moon" className="w-5 h-5" />}
                            </button>
                            
                            {/* ใช้ Component ใหม่ตรงนี้: เพื่อดึงรูปมาโชว์เอง */}
                            <NavbarUser 
                                user={currentUser} 
                                db={db} 
                                appId={appId} 
                                onViewProfile={() => { setCurrentView('profile'); setSelectedCourse(null); }} 
                            />

                            {isAdmin && (
                                <>
                                <button onClick={() => { setCurrentView('home'); setSelectedCourse(null); }} className={`hidden sm:flex items-center px-3 py-2 rounded-lg text-sm font-medium ${currentView==='home' && !selectedCourse ?'text-red-600 bg-red-50 dark:bg-red-900/20':'text-gray-600 dark:text-gray-300 hover:text-red-500'}`}><Icon name="Home" className="mr-1 w-5 h-5"/>Home</button>
                                <button onClick={() => { setCurrentView('admin'); setSelectedCourse(null); }} className={`hidden sm:flex items-center px-3 py-2 rounded-lg text-sm font-medium ${currentView==='admin'?'text-red-600 bg-red-50 dark:bg-red-900/20':'text-gray-600 dark:text-gray-300 hover:text-red-500'}`}><Icon name="Settings" className="mr-1 w-5 h-5"/>Admin</button>
                                </>
                            )}
                            <button onClick={handleSignOut} className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150"><Icon name="LogOut" className="mr-2 w-5 h-5"/><span className="hidden sm:inline">Sign Out</span></button>
                        </div>
                    </div>
                </div>
            </nav>
            {(() => {
                if (selectedCourse) {
                    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
                }
                switch(currentView) {
                    case 'admin':
                        return isAdmin ? <AdminDashboard courses={courses} db={db} appId={appId} userId={currentUser.uid} setView={setCurrentView} /> : <CourseList courses={courses} userId={currentUser.uid} onCourseSelect={handleCourseSelect} />;
                    case 'profile':
                        return <UserProfile user={currentUser} db={db} appId={appId} onBack={() => setCurrentView('home')} />;
                    default: 
                        return <CourseList courses={courses} userId={currentUser.uid} onCourseSelect={handleCourseSelect} />;
                }
            })()}
            <footer className="bg-gray-800 text-white p-4 text-center text-sm mt-auto">© 2023 Learnify E-Learning Platform</footer>
        </div>
    );
};

export default App;