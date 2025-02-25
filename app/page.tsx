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
import { v2 as cloudinary } from "cloudinary";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    try {
      //upload on cloudinary
      const cloudinaryImageUrl = await cloudinary.uploader.upload(
        selectedImage,
        {
          resource_type: "auto",
        }
      );

      console.log("cloud url is - ", cloudinaryImageUrl);

      // if uploaded, call api
      fetch("/api/analyze-image", {
        method: "POST",
        body: JSON.stringify({ ImageUrl: cloudinaryImageUrl }),
        // Note: Don't set Content-Type header when using FormData
        // The browser will set it automatically with the boundary
      })
        .then((res) => res.json())
        .then((data) => setAnalysisReport(data))
        .catch((e) => console.error(e));
    } catch (e) {
      console.error(e);
    }
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
                    accept="image/*"
                    onChange={handleImageChange}
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

          {analysisReport && <Card>Report found!</Card>}
        </div>
      </div>
    </div>
  );
}
