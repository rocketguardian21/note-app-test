import React from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import TurndownService from 'turndown';

const ExportMenu = ({ note }) => {
    const menu = React.useRef(null);
    const turndownService = new TurndownService();

    const exportToPDF = async () => {
        try {
            // Importar pdfMake dinámicamente
            const pdfMake = await import('pdfmake/build/pdfmake');
            const pdfFonts = await import('pdfmake/build/vfs_fonts');
            const htmlToPdfmake = await import('html-to-pdfmake');

            // Configurar pdfMake
            pdfMake.default.vfs = pdfFonts.default.pdfMake.vfs;

            const html = note.body;
            const content = htmlToPdfmake.default(html);

            const documentDefinition = {
                content: [
                    { text: note.title, style: 'header' },
                    { text: '\n' },
                    content
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        marginBottom: 10
                    }
                }
            };

            // Agregar tags si existen
            if (note.tags && note.tags.length > 0) {
                documentDefinition.content.push(
                    { text: '\nTags:', style: 'subheader' },
                    { text: note.tags.join(', ') }
                );
            }

            pdfMake.default.createPdf(documentDefinition).download(`${note.title}.pdf`);
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const exportToMarkdown = () => {
        try {
            // Convertir el contenido HTML a Markdown
            const markdown = turndownService.turndown(note.body);
            
            // Crear el contenido completo del archivo Markdown
            const fullMarkdown = `# ${note.title}\n\n${markdown}${note.tags && note.tags.length > 0 ? '\n\nTags: ' + note.tags.join(', ') : ''}`;
            
            // Crear y descargar el archivo
            const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar Markdown:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    const items = [
        {
            label: 'Exportar como PDF',
            icon: 'pi pi-file-pdf',
            command: exportToPDF
        },
        {
            label: 'Exportar como Markdown',
            icon: 'pi pi-file',
            command: exportToMarkdown
        }
    ];

    return (
        <div className="export-menu">
            <Menu model={items} popup ref={menu} />
            <Button
                icon="pi pi-download"
                className="p-button-rounded p-button-text"
                onClick={(e) => menu.current.toggle(e)}
                tooltip="Exportar nota"
            />
        </div>
    );
};

export default ExportMenu; 