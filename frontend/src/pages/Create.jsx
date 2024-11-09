'use client';

import React, { useRef, useState } from 'react';
import { FaImage, FaPlus } from "react-icons/fa";
import { PinData } from "../context/PinContext";
import { useNavigate } from "react-router-dom";

export default function CreatePin() {
  // Reusable Button component
  const Button = ({ variant = 'solid', children, ...props }) => {
    return (
      <button
        {...props}
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border border-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
      >
        {children}
      </button>
    );
  };

  // Reusable Input component
  const Input = (props) => {
    return (
      <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    );
  };

  // Reusable Textarea component
  const Textarea = (props) => {
    return (
      <textarea
        {...props}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    );
  };

  // Reusable Card component
  const Card = ({ children, className }) => {
    return (
      <div className={`bg-white shadow-lg rounded-lg ${className}`}>
        {children}
      </div>
    );
  };

  // Reusable CardContent component
  const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
  };

  // State and logic for CreatePin component
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { addPin } = PinData();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImagePreview(reader.result);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setImagePreview(reader.result);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("pin", pin);
    if (image) formData.append("file", image);
    addPin(formData, setImagePreview, setImage, setTitle, setDescription, navigate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Create a New Pin</h2>

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover mb-2" />
              ) : (
                <div className="text-gray-500">
                  <FaImage className="mx-auto h-12 w-12 mb-2" />
                  <p>Upload Image or Drag and Drop</p>
                  <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <Input
              type="text"
              placeholder="Add your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              placeholder="Tell everyone what your Pin is about"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />

            <Input
              type="text"
              placeholder="Pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">
                <FaPlus className="inline-block mr-1" /> Create Pin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
