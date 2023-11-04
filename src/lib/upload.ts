export default function upload(){
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: Event) => {
        // @ts-ignore
        const file = event.target.files[0]; // 선
        console.log(file);
        document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
}