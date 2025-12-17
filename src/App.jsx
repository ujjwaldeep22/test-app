import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const [notes, setnotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 REALTIME LISTENER
  useEffect(() => {
    const q = query(
      collection(db, "notes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setnotes(notesData);
        setLoading(false);
      },
      (error) => {
        console.error("Realtime error:", error);
        setLoading(false);
      }
    );

    // cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // ➕ ADD NOTE
  const addNote = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    await addDoc(collection(db, "notes"), {
      title,
      content,
      createdAt: serverTimestamp(),
    });

    settitle("");
    setcontent("");
  };

  // ❌ DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Check Firestore rules.");
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-auto text-white">
      <div className="flex flex-col lg:flex-row justify-between">

        {/* LEFT SECTION */}
        <div className="w-full lg:w-3/5">
          <form
            onSubmit={addNote}
            className="p-10 flex flex-col items-start"
          >
            <input
              type="text"
              placeholder="Enter your note"
              className="mb-4 p-2 border border-gray-300 rounded w-full lg:w-3/4 bg-black text-white"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note here..."
              className="mb-4 p-2 border border-gray-300 rounded w-full lg:w-3/4 h-80 bg-black text-white"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
            ></textarea>

            <button className="bg-green-500 text-black px-4 py-2 rounded w-1/2 hover:bg-green-600 active:scale-95">
              Add Note
            </button>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-2/5 lg:border-l-2 border-gray-600 min-h-screen overflow-auto">
          {loading && (
            <p className="p-4 text-gray-400">Loading notes...</p>
          )}

          {!loading && notes.length === 0 && (
            <p className="p-4 text-gray-400">No notes yet.</p>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              className="relative bg-green-500 text-black p-4 m-4 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-2">
                {note.title || "Untitled"}
              </h2>

              <p className="whitespace-pre-wrap">{note.content}</p>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 active:scale-95 absolute top-2 right-2"
                onClick={() => deleteNote(note.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default App;
