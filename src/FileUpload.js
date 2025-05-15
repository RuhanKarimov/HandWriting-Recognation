import React, { useState } from 'react';
import axios from 'axios'; // axios kütüphanesini import et
import './FileUpload.css';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [apiResponseList, setApiResponseList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setApiResponseList(null);
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
            const response = await axios.post('http://localhost:5002/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // axios otomatik olarak ayarlamaz
                },
            });

            setApiResponseList(response.data); // axios response'unun datası doğrudan JSON'dır
            console.log('API Response List (axios):', response.data);

        } catch (err) {
            setError(`Yükleme hatası: ${err.message}`);
            console.error('Upload Error (axios):', err);
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
                    <h2>Model Tahminleri : </h2>
                    <ul>
                        {apiResponseList.map((item, index) => (
                            <li key={index}>
                                <strong>Yazar:</strong> {item.predicted_author} ,<br></br> <strong>İçerik:</strong> {item.predicted_text}
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