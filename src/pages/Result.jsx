import '../styles/Result.css'; // Yol senin yapına göre olabilir


import { useEffect, useState } from "react";
function groupConsecutiveByAuthor(entries) {
    const groups = [];
    let currentGroup = null;

    for (const entry of entries) {
        if (!currentGroup || currentGroup.author !== entry.predicted_author) {
            if (currentGroup) groups.push(currentGroup);
            currentGroup = {
                author: entry.predicted_author,
                texts: [entry.predicted_text]
                // texts: [{
                //     text: entry.predicted_text,
                //     line: entry.line_number
                // }]
            };
        } else {
            currentGroup.texts.push(entry.predicted_text);

            // currentGroup.texts.push({
            //     text: entry.predicted_text,
            //     line: entry.line_number
            // });
        }
    }

    if (currentGroup) groups.push(currentGroup);
    return groups;
}


export default function Result() {

    const [results, setResults] = useState([]);
    const [visibleImages, setVisibleImages] = useState({});

    const toggleImageVisibility = (timestamp) => {
        setVisibleImages((prev) => ({
            ...prev,
            [timestamp]: !prev[timestamp],
        }));
    };

    const handleDelete = (timestampToDelete) => {
        const updated = results.filter(entry => entry.timestamp !== timestampToDelete);
        setResults(updated);
        localStorage.setItem("results", JSON.stringify(updated));
    };


    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("results")) || [];
        setResults(saved);
    }, []);

    return (
        <div className="container mt-5">
            <h3>Yüklenen Tüm Sonuçlar</h3>

            {results.length === 0 ? (
                <p>Henüz bir sonuç yüklenmedi.</p>
            ) : (
                results.map((entry, index) => (

                    <div key={index} className="card mb-4 shadow-sm position-relative">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">{entry.fileName}</h5>

                                <div className="d-flex gap-2">
                                    {entry.imageData && (
                                        <button
                                            className="btn btn-sm btn-outline-secondary fade-button"
                                            onClick={() => toggleImageVisibility(entry.timestamp)}
                                        >
                                            <span className="fade-button-text">
                                            {visibleImages[entry.timestamp] ? "Gizle" : "Görseli Göster"}
                                            </span>
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(entry.timestamp)}
                                    >
                                        🗑️ Sil
                                    </button>
                                </div>
                            </div>
                            <div
                                className={`fade-image ${visibleImages[entry.timestamp] ? 'show' : ''} mb-3 mt-3`}
                            >
                                <img
                                    src={entry.imageData}
                                    alt={entry.fileName}
                                    className="img-fluid rounded"
                                    style={{ objectFit: "contain", width: "100%" }}
                                />
                            </div>


                            <small className="text-muted">
                                {new Date(entry.timestamp).toLocaleString()}
                            </small>

                            <div className="mt-3">
                                {groupConsecutiveByAuthor(entry.result).map((group, i) => (
                                    <div key={i} className="card mb-2">
                                        <div className="card-header bg-secondary text-white">
                                            👤 {group.author}
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            {group.texts.map((line, j) => (
                                                <li className="list-group-item" key={j}>{line}</li>
                                            ))}
                                            {/*{group.texts.map((lineObj, j) => (*/}
                                            {/*    <li className="list-group-item" key={j}>*/}
                                            {/*        <strong>Satır {lineObj.line}:</strong> {lineObj.text}*/}
                                            {/*    </li>*/}
                                            {/*))}*/}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))

            )}
        </div>
    );
}
