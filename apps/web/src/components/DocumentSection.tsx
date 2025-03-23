import React, { useState } from "react";
import { saveAs } from 'file-saver';
import { Plus, FileText, Folder, ChevronRight, Search, Send, Youtube, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import instance, { pyServer } from "@/axios/axios.config"
import { useToast } from "@/hooks/use-toast"

interface Section {
    id: string;
    title: string;
    files: CustomFile[];
    isExpanded: boolean;
}

export interface CustomFile {
    id: string;
    title: string;
    type: "pdf" | "doc" | "txt";
    dateModified: Date;
    path: string,
    dname: string
}

interface DocumentSectionProps {
    sections: Section[];
    onToggleSection: (id: string) => void;
}

export const DocumentSections: React.FC<DocumentSectionProps> = ({
    sections,
    onToggleSection,
}) => {
    const { toast } = useToast()
    const [description, setdescription] = useState("");
    const [file, setfile] = useState<File | null>(null);
    const [title, settitle] = useState("");
    const [open, setopen] = useState(false)
    const [isCustomCategory, setIsCustomCategory] = useState(false)
    const [customCategory, setCustomCategory] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")

    async function uploadFileToCloud(body: any) {
        const data = await instance.post('/cloud', body, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setfile(selectedFile);
        }
    };

    const handleDownload = async (fileId: string, fileName: string, fileExt: string) => {
        try {
            const response = await instance.get(`/cloud/download/${fileName}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            saveAs(blob, `${fileName}.${fileExt}`);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast({
                title: "Download failed",
                description: "Unable to download the file. Please try again later.",
            });
        }
    };



    const handleCategoryChange = (value) => {
        setSelectedCategory(value)
        if (value === "custom") {
            setIsCustomCategory(true)
        } else {
            setIsCustomCategory(false)
        }
    }


    const getFileExtension = (file: File): string => {
        const parts = file.name.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1].toLowerCase();
        }
        return '';
    };

    const handleSubmit = async () => {
        console.log(file)
        console.log(title)
        if (!file || !title || !selectedCategory) {
            alert("Please fill all fields before submitting.");
            return;
        }
        const formData = new FormData();

        formData.append('file', file);
        formData.append('section', selectedCategory == "custom" ? customCategory : selectedCategory);
        formData.append('filetype', getFileExtension(file));
        formData.append('title', title);
        formData.append('description', description || "");
        formData.append('fileSize', file.size.toString());
        formData.append('path', `/uploads/${file.name}`);
        console.log(formData)
        try {
            const response = await uploadFileToCloud(formData);
            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "File and metadata uploaded successfully!",
                });
                setopen(false)
            } else {
                toast({
                    title: "Upload failed.",
                });
            }
        } catch (error) {
            console.error("Error uploading file and metadata:", error);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="fixed bottom-16 right-4">
                </div>
                <Dialog open={open} onOpenChange={setopen}>
                    <DialogTrigger asChild>
                        <button
                            className="flex items-center space-x-1 text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Add File</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
                        <DialogHeader>
                            <DialogTitle>Upload Content</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="bg-background text-foreground">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="economics">Economics</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isCustomCategory && (
                                    <div className="mt-2">
                                        <Input
                                            placeholder="Enter custom category"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="bg-background text-foreground"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" type="file" onChange={handleFileChange} className="bg-background text-foreground" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => settitle(e.target.value)}
                                    placeholder="Title will appear when file is selected"
                                    className="bg-background text-foreground"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setdescription(e.target.value)}
                                    placeholder="Enter description"
                                    className="bg-background text-foreground"
                                />
                            </div>
                        </div>
                        <Button onClick={handleSubmit} className="mt-4">
                            Submit
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-200 pb-3">
                        <button
                            onClick={() => onToggleSection(section.id)}
                            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-700 hover:text-gray-900"
                        >
                            <div className="flex items-center">
                                <Folder size={18} className="text-blue-500 mr-2" />
                                <span>{section.title}</span>
                            </div>
                            <ChevronRight
                                size={18}
                                className={`text-gray-400 transition-transform ${section.isExpanded ? "rotate-90" : ""}`}
                            />
                        </button>

                        {section.isExpanded && (
                            <div className="mt-2 pl-6 space-y-1 animate-fade-in">
                                {section.files.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => handleDownload(file.title, file.title, file.type)}
                                        className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <FileText size={16} className="text-gray-500 mr-2" />
                                        <span className="text-gray-700 text-sm">{file.dname}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export const DocumentChatInput = () => {
    const [isFileTextEnabled, setIsFileTextEnabled] = useState(false);
    const [isYoutubeEnabled, setIsYoutubeEnabled] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const { toast } = useToast()

    const handleFileTextClick = () => {
        setIsFileTextEnabled(true);
        setIsYoutubeEnabled(false);
    };

    const handleYoutubeClick = () => {
        setIsYoutubeEnabled(true);
        setIsFileTextEnabled(false);
    };

    const handleSendClick = async () => {
        setIsThinking(true);

        if (isFileTextEnabled) {
            await callFileTextAPI(inputValue);
        } else if (isYoutubeEnabled) {
            await callYoutubeAPI(inputValue);
        }

        setIsThinking(false);
        setInputValue('');
    };

    const callFileTextAPI = async (message: string) => {
        let response = await pyServer.post('/emailautomation/', {
            question: message
        })
        if (response.status === 200) {
            toast({
                title: "Email sent successfully"
            })
        }
        console.log(response)
    };

    const callYoutubeAPI = async (message: string) => {
        let response = await pyServer.post('/extractionyoutube', {
            question: message
        })

        let st = await uploadFileToCloud({
            title: response.data.title,
            path: response.data.title,
            section: "Youtube",
            filetype: "mp4",
            fileSize: 2000
        })
        if (st.status == 201) {
            toast({
                title: "Youtube Segment Download Success"
            })
        };
    }

    async function uploadFileToCloud(body: any) {
        const data = await instance.post('/cloud/new', body);
        return data;
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <div className="relative flex items-center">
                <button
                    onClick={handleFileTextClick}
                    className={`absolute left-3 p-1.5 rounded-full ${isFileTextEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                    <FileText size={16} />
                </button>

                <button
                    onClick={handleYoutubeClick}
                    className={`absolute left-12 p-1.5 rounded-full ${isYoutubeEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                    <Youtube size={18} />
                </button>

                <textarea
                    placeholder="Ask about this document..."
                    rows={1}
                    className="chat-input pl-20 pr-12 resize-none overflow-hidden"
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                {isThinking ? (
                    <div className="absolute right-3 p-1.5">
                        <Loader size={16} className="animate-spin" />
                    </div>
                ) : (
                    <button
                        onClick={handleSendClick}
                        className="absolute right-3 p-1.5 rounded-full bg-blue-500 text-white"
                        disabled={!inputValue.trim() || (!isFileTextEnabled && !isYoutubeEnabled)}
                    >
                        <Send size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
