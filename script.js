document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 处理拖放上传
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 处理点击上传
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 处理图片文件
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }

        currentFile = file;
        originalSize.textContent = formatFileSize(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(e.target.result, qualitySlider.value);
        };
        reader.readAsDataURL(file);

        previewContainer.style.display = 'block';
    }

    // 压缩图片
    function compressImage(dataUrl, quality) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
            compressedImage.src = compressedDataUrl;

            // 计算压缩后的大小
            const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
            document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
        };
        img.src = dataUrl;
    }

    // 质量滑块事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage.src) {
            compressImage(originalImage.src, e.target.value);
        }
    });

    // 下载按钮事件
    downloadBtn.addEventListener('click', () => {
        if (compressedImage.src) {
            const link = document.createElement('a');
            link.download = 'compressed_' + currentFile.name;
            link.href = compressedImage.src;
            link.click();
        }
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 