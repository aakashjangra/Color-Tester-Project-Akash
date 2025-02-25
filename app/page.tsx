"use client";

import type React from "react";

import { useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ColorCard } from "@/components/ColorCard";
import { validateColors } from "./utils/colorComparison";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [analysisReport, setAnalysisReport] = useState<any>();

  const extractColors = (file: File) => {
    // Create new canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create new image object
    const img = new window.Image();
    
    // When image loads, process it
    img.onload = () => {
      // Step 1: Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Step 2: Draw image onto canvas
      ctx?.drawImage(img, 0, 0);
      
      // Step 3: Extract colors from specific points
      const colors: string[] = [];
      
      // Sample from 5 different points
      const samplePoints = [
        { x: Math.floor(img.width * 0.2), y: Math.floor(img.height * 0.2) },  // Top left
        { x: Math.floor(img.width * 0.8), y: Math.floor(img.height * 0.2) },  // Top right
        { x: Math.floor(img.width * 0.5), y: Math.floor(img.height * 0.5) },  // Center
        { x: Math.floor(img.width * 0.2), y: Math.floor(img.height * 0.8) },  // Bottom left
        { x: Math.floor(img.width * 0.8), y: Math.floor(img.height * 0.8) }   // Bottom right
      ];
      
      samplePoints.forEach(point => {
        // Get pixel data (returns R,G,B,A values)
        const pixelData = ctx?.getImageData(point.x, point.y, 1, 1).data;
        if (pixelData) {
          // Convert RGB to HEX
          const hex = `#${[pixelData[0], pixelData[1], pixelData[2]]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')}`;
          colors.push(hex);
        }
      });
      
      setSelectedColors(colors);
    };
    
    // Set image source to start loading
    img.src = URL.createObjectURL(file);
    setSelectedImage(img.src);
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setSelectedImage(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  const analyzeImage = async () => {
    // try {
    //   const formData = new FormData();
    //   formData.append('image', selectedImage);

    //   const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze-image`;

    //   axios.post(apiUrl, formData)
    //   .then(response => {
    //       console.log('Upload successful:', response.data);
    //   })
    //   .catch(error => {
    //       console.error('Upload failed:', error);
    //   });
    // } catch (e) {
    //   console.error(e);
    // }

    console.log('colors are - ', selectedColors)
    
    const validationResults = validateColors(selectedColors);
    setAnalysisReport(JSON.stringify(validationResults, null, 2));

  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F8F3D9" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: "#504B38" }}>
            Color Matcher
          </h1>
          <p className="text-lg" style={{ color: "#B9B28A" }}>
            Upload an image to match it with our brand colors
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6" style={{ backgroundColor: "#EBE5C2" }}>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#504B38" }}
            >
              Our Brand Colors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ColorCard name="Primary Red" hex="#FF0000" />
              <ColorCard name="Deep Navy" hex="#003DA5" />
              <ColorCard name="Light Blue" hex="#72B5E8" />
              <ColorCard name="Gray" hex="#54585A" />
              <ColorCard name="Yellow" hex="#FFB612" />
              <ColorCard name="Green" hex="#158B45" />
            </div>
          </Card>

          <Card className="p-6" style={{ backgroundColor: "#EBE5C2" }}>
            <div className="space-y-4">
              <h2
                className="text-xl font-semibold"
                style={{ color: "#504B38" }}
              >
                Upload Image
              </h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image">Select an image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/bmp, image/svg+xml, image/tiff"
                    onChange={(e) => e.target.files?.[0] && extractColors(e.target.files[0])}
                  />
                </div>
                {selectedImage && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected image"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <Button className="w-full" size="lg" onClick={analyzeImage}>
                  <Upload className="w-4 h-4 mr-2" />
                  Analyze Image
                </Button>
              </div>
            </div>
          </Card>

          {selectedColors.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Sampled Colors:</h3>
            <div className="flex gap-2">
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div
                    className="w-12 h-12 rounded shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded p-1">
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {analysisReport && <Card>
            <pre>{analysisReport}</pre>
          </Card>}
        </div>
      </div>
    </div>
  );
}
