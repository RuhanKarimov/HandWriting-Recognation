import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [apiResponseList, setApiResponseList] = useState(null); // Liste şeklinde cevap için state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setApiResponseList(null); // Yeni dosya seçildiğinde önceki listeyi temizle
            setError(null);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Lütfen önce bir dosya seçin.');
            return;
        }

        setLoading(true);
        setApiResponseList(null);
        setError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Dosya yüklenirken bir hata oluştu.');
            }

            setApiResponseList(data); // API cevabını (liste) state'e kaydet
            console.log('API Response List:', data);

        } catch (err) {
            setError(`Yükleme hatası: ${err.message}`);
            console.error('Upload Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <h1>Fotoğraf Yükle</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedFile && (
                <p>Seçilen Dosya: {selectedFile.name}</p>
            )}
            <button onClick={handleUpload} disabled={!selectedFile || loading}>
                {loading ? 'Yükleniyor...' : 'Fotoğrafı Gönder'}
            </button>

            {error && (
                <div className="error-message">
                    Hata: {error}
                </div>
            )}

            {apiResponseList && apiResponseList.length > 0 && (
                <div className="response-list">
                    <h2>API Cevapları:</h2>
                    <ul>
                        {apiResponseList.map((item, index) => (
                            <li key={index}>
                                <strong>İçerik:</strong> {item.icerik}, <strong>Yazar:</strong> {item.yazar}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {apiResponseList && apiResponseList.length === 0 && (
                <div className="response-message">
                    API'den boş bir liste döndü.
                </div>
            )}
        </div>
    );
}

export default FileUpload;