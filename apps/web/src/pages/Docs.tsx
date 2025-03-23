import { useEffect, useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import { DocumentSections, DocumentChatInput, CustomFile } from "@/components/DocumentSection";
import instance from "@/axios/axios.config";
import useAuth from "@/hooks/useAuth";


interface Section {
    id: string;
    title: string;
    files: CustomFile[];
    isExpanded: boolean;
}


const Docs = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const { isLoading, user } = useAuth()

    async function fetchFilesByAuthor(authorId: string): Promise<Section[]> {
        const { data } = await instance.get(`/cloud/author/${authorId}`);

        const groupedFiles = data.reduce((acc: Record<string, CustomFile[]>, file: any) => {
            const section = file.section;
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push({
                id: file.id,
                title: file.title,
                type: file.filetype as "pdf" | "doc" | "txt", 
                dateModified: new Date(file.createdAt),
                path: file.path,
                dname: file.dname
            });
            return acc;
        }, {});

        const newsections: Section[] = Object.keys(groupedFiles).map((sectionTitle) => ({
            id: `section-${sectionTitle}`, // Dummy ID for section
            title: sectionTitle,
            files: groupedFiles[sectionTitle],
            isExpanded: false, // Default to collapsed
        }));

        console.log(newsections)
        setSections([...newsections])
        return sections;
    }
    const handleToggleSection = (id: string) => {
        setSections(prevSections =>
            prevSections.map(section =>
                section.id === id
                    ? { ...section, isExpanded: !section.isExpanded }
                    : section
            )
        );
    };

    useEffect(() => {
        if (user == null || user == undefined) return
        fetchFilesByAuthor(user.id)
    }, [user,isLoading])


    return (
        <div className="min-h-screen bg-white">
            <NavigationBar />

            <div className="w-full px-0 md:px-4 max-w-[100vw] overflow-x-hidden">
                <div className="glass rounded-lg p-4 md:p-6 mb-4 mx-auto">
                    <DocumentSections
                        sections={sections}
                        onToggleSection={handleToggleSection}
                    />
                    <div className="fixed bottom-16 right-4">
                    </div>

                    <DocumentChatInput />
                </div>
            </div>
        </div>
    );
};

export default Docs;
