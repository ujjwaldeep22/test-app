import React, { useState, useEffect } from 'react'

const App = () => {
  const [title, settitle] = useState('')
  const [content, setcontent] = useState('')
  const [notes, setnotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const deleteNote = (index) => {
    setnotes(notes.filter((_, i) => i !== index));
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div className="min-h-screen bg-black overflow-auto">
      <div className="flex flex-col lg:flex-row justify-between">

        {/* LEFT SECTION - FORM */}
        <div className="w-full lg:w-3/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (title.trim() === "" && content.trim() === "") return;

              const newNote = [...notes];
              newNote.push({ title, content });
              setnotes(newNote);

              settitle('');
              setcontent('');
            }}
            className="p-10 flex flex-col items-start"
          >
            <input
              type="text"
              placeholder="Enter your note"
              className="mb-4 p-2 border border-gray-300 rounded w-full lg:w-3/4 text-white"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />

            <textarea
              placeholder="Write your note here..."
              className="mb-4 p-2 border border-gray-300 rounded w-full lg:w-3/4 h-80 text-white"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
            ></textarea>

            <button className="bg-green-500 text-white px-4 py-2 rounded w-1/2 hover:bg-green-700 active:scale-95 cursor-pointer">
              Add Note
            </button>
          </form>
        </div>

        {/* RIGHT SECTION - NOTES */}
        <div className="w-full lg:w-2/5 lg:border-l-2 border-gray-600 min-h-screen overflow-auto">
          {notes.map((note, index) => (
            <div key={index} className="relative bg-green-500 text-white p-4 m-4 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">{note.title}</h2>
              <p>{note.content}</p>

              <button
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-800 active:scale-95 absolute top-2 right-2"
                onClick={() => deleteNote(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default App
