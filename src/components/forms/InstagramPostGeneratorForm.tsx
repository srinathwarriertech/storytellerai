"use client";

import { useState } from "react";
import { Box, Typography, TextField, Alert, Button, CircularProgress } from "@mui/material";
import GradientButton from "@/components/ui/GradientButton";
import ModernCard from "@/components/ui/ModernCard";

const MagicIcon = () => <div className="w-5 h-5">✨</div>;

export default function InstagramStoryGeneratorForm() {
  const [formData, setFormData] = useState({
    topic: "",
    referencePost: "",
    brandGuide: "",
    youtubeChannelId: "",
    file: null as File | null,
    fileContent: "",
    imageAnalysisPrompt: "", // Add this new field
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [story, setStory] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [base64, setBase64] = useState<string | null>(null);

  const handleChange = (field: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFetchTranscripts = async () => {
    if (!formData.youtubeChannelId) {
      setError("Please enter a YouTube channel ID");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/fetch-youtube-transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: formData.youtubeChannelId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transcripts");
      }

      // Auto-fill the topic field with the channel name if it's empty
      if (!formData.topic && data.channelName) {
        setFormData((prev) => ({ ...prev, topic: data.channelName }));
      }

      setSuccess(`Successfully fetched ${data.transcripts.length} video transcripts`);
    } catch (err) {
      console.error("Error fetching transcripts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transcripts. Please check the channel ID and try again.");
    } finally {
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64String = await convertFileToBase64(file);
      setBase64(base64String);
      // Add this line to update the formData state so the UI shows the file name
      setFormData((prev) => ({ ...prev, file }));
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Failed to read the file. Please try another file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    try {
      const payload = {
        ...formData,
        file: undefined, // Don't send the File object directly
        fileName: formData.file?.name || "",
        imageUrl: base64,
        textInput: formData.imageAnalysisPrompt,
      };

      const response = await fetch("/api/instagrampost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to generate story");
      let data: any = await response.json();
      let reasoning = "";

      data = data["instagramPost"];
      console.log("data", typeof data, data);

      // if (data.split("</think>")[1]) {
      //   reasoning = data.split("</think>")[0].split("<think>")[1].trim();
      //   data = data.split("</think>")[1].trim();
      // }

      // Format the story text when received from API
      const formatStoryText = (text: string) => {
        return text
          .replace(/\\n/g, "\n") // Convert \n to actual line breaks
          .replace(/\\t/g, "\n") // Convert \t to line breaks (start from next line)
          .replace(/\n\s*\n/g, "\n") // Clean up multiple line breaks
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .trim(); // Remove leading/trailing whitespace
      };

      setReasoning(reasoning);
      setStory(formatStoryText(data));
      // router.push(`/dashboard/stories/${data.story.id}`);
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ModernCard className="max-w-4xl mx-auto">
      <Box className="text-center mb-8">
        <Box className="flex items-center justify-center mb-4"></Box>
        <Typography variant="h3" className="text-gradient mb-2">
          Create Your Story
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let AI craft a unique, engaging story tailored to your preferences
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            Upload Reference File
          </Typography>
          <Box className="flex gap-3">
            {/* File Input Display */}
            <Box className="flex-1">
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".txt,.md,.pdf,.doc,.docx" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Box
                  className={`
                    border border-gray-300 rounded-lg px-4 py-3 cursor-pointer
                    hover:border-gray-400 transition-colors duration-200
                    ${formData.file ? "border-primary-500 bg-primary-50" : "border-gray-300"}
                  `}
                >
                  <Typography variant="body1" className={`${formData.file ? "text-gray-900" : "text-gray-500"}`}>
                    {formData.file ? formData.file.name : "Choose file..."}
                  </Typography>
                </Box>
              </label>
            </Box>

            {/* Upload Button */}
            <Box>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Box
                  className="
                    bg-gray-100 hover:bg-gray-200 
                    border border-gray-300 rounded-lg 
                    px-6 py-3 cursor-pointer
                    transition-colors duration-200
                    flex items-center justify-center
                    min-w-[140px]
                  "
                >
                  <Typography variant="body2" className="text-gray-700 font-medium uppercase tracking-wide">
                    {formData.file ? "Change File" : "Browse"}
                  </Typography>
                </Box>
              </label>
            </Box>
          </Box>

          {/* File Type Info */}
          <Typography variant="body2" className="text-gray-500 mt-2">
            Supports .jpg
          </Typography>
        </Box>

        {/* Image Analysis Prompt */}
        <Box>
          <Typography variant="h6" className="mb-3 font-semibold">
            What information do you need from this image?
          </Typography>
          <Box className="flex gap-3">
            <Box className="flex-1">
              <input
                type="text"
                placeholder="e.g., Extract text content, identify objects, analyze colors, describe the scene..."
                value={formData.imageAnalysisPrompt}
                onChange={(e) => handleChange("imageAnalysisPrompt", e.target.value)}
                className="
                  w-full px-4 py-3 
                  border border-gray-300 rounded-lg
                  focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200
                  transition-colors duration-200
                  placeholder-gray-400
                "
              />
            </Box>
          </Box>
          <Typography variant="body2" className="text-gray-500 mt-2">
            Describe what you want the AI to analyze or extract from your uploaded image
          </Typography>
        </Box>

        {/* Reference Post */}

        <Box className="pt-4 text-white">
          <GradientButton type="submit" loading={isGenerating} disabled={isGenerating} className="w-full py-4 text-lg">
            {isGenerating ? "Crafting Your Story..." : "Generate My Story"}
          </GradientButton>
        </Box>

        {error && (
          <Alert severity="error" className="rounded-xl">
            {error}
          </Alert>
        )}

        {story && reasoning && (
          <Box>
            <Typography variant="h6" className="mb-3 font-semibold">
              Reasoning
            </Typography>
            <TextField
              fullWidth
              value={reasoning}
              multiline
              rows={10}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          </Box>
        )}
        {story && (
          <Box>
            <Typography variant="h6" className="mb-3 font-semibold">
              Story
            </Typography>
            <TextField
              fullWidth
              value={story}
              multiline
              rows={10}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
          </Box>
        )}
      </form>
    </ModernCard>
  );
}
