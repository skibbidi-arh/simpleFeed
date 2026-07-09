import { useState, useRef } from 'react';
import { uploadPost } from '../api';

export default function UploadModal({ onUploaded }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCaption('');
    setError('');
    setDragOver(false);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      await uploadPost(file, caption);
      handleClose();
      onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = file?.type.startsWith('video/');

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="upload-fab"
        className="upload-fab"
        onClick={() => setOpen(true)}
        title="Create new post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button className="modal-close" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="upload-error">{error}</div>}

              {!file ? (
                /* Drop Zone */
                <div
                  className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => inputRef.current?.click()}
                >
                  <div className="drop-zone-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <h3>Drag & drop your file here</h3>
                  <p>or click to browse · Images & videos</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <>
                  {/* Preview */}
                  <div className="upload-preview">
                    {isVideo ? (
                      <video controls preload="metadata">
                        <source src={preview} />
                      </video>
                    ) : (
                      <img src={preview} alt="Preview" />
                    )}
                    <button
                      className="upload-preview-remove"
                      onClick={() => { setFile(null); setPreview(null); }}
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Caption */}
                  <textarea
                    id="upload-caption"
                    className="upload-caption"
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={500}
                  />

                  {/* Submit */}
                  <button
                    id="upload-submit"
                    className="upload-submit"
                    onClick={handleSubmit}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Share Post
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
