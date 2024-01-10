function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (!bytes) {
        return '0 Byte'
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}
const element = (tag,classes = [],content) => {
    const node = document.createElement(tag)
    if (classes.length){
        node.classList.add(...classes)
    }
    if (content){
        node.textContent = content
    }
    return node
}
function noop(){

}
export function upload(selector,options={}){
    let files = []
    let onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector)
    const body = document.querySelector('.modal-body')
    const preview = element('div',['preview'])

    let newOpen = true

    const openHandler = () => {
        const imageUrl = document.getElementById('imageUrl').value;
        body.insertAdjacentElement('beforeend',preview)
        input.insertAdjacentElement('afterend',upload)
        input.insertAdjacentElement('afterend',open)

        if (imageUrl) {
            if (newOpen){
                preview.insertAdjacentHTML('afterbegin',`
                    <div class="preview-image">
                        <img src="${imageUrl}" alt=""/>
                    </div>
                `)
                newOpen = false
            }
        }
        const event = new Event('change');
        input.dispatchEvent(event);
    };

    const edit = document.getElementById('editImage')
    if (edit){
        edit.addEventListener('click', openHandler);
    }

    const closeHandler = () => {
        const event = new Event('change');
        input.dispatchEvent(event);
    }

    const close = document.querySelector('.btn-close')
    close.addEventListener('click',closeHandler)

    const open = element('button',['btn','btn-secondary',],'Open')
    const upload = element('button',['btn','btn-primary','ms-3'],'Load')
    upload.style.display = 'none'

    if (options.multi){
        input.setAttribute('multiple',true)
    }
    if(options.accept&& Array.isArray(options.accept)){
        input.setAttribute('accept',options.accept.join(','))
    }

    body.insertAdjacentElement('beforeend',preview)
    input.insertAdjacentElement('afterend',upload)
    input.insertAdjacentElement('afterend',open)

    const triggerInput = () => {
        input.click();
    }
    const changeHandler = event => {

        if (!event.target.files.length){
            return
        }
        files = Array.from(event.target.files)
        preview.innerHTML = ''
        upload.style.display = 'inline'

        files.forEach(file => {
            if(!file.type.match('image')){
                return
            }
            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin',`
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}"/>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })

    }

    const removeHandler = event => {
        if (!event.target.dataset.name){
            return
        }
        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)

        if (!files.length){
            upload.style.display = 'none'
        }

        const block = preview.querySelector(`[data-name ="${name}"]`).closest('.preview-image')
        block.classList.add('removing')
        setTimeout(() =>block.remove(),300)
    }
    const clearPreview = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)

        onUpload(files,previewInfo)
        open.disabled = true
        upload.disabled = true
    }

    open.addEventListener('click', (event) => {
        event.preventDefault()
        triggerInput()
    });



    input.addEventListener('change',changeHandler)

    preview.addEventListener('click',removeHandler)

    upload.addEventListener('click',(event) => {

        event.preventDefault()
        const userConfirmed = confirm('Are you sure?')

        if (userConfirmed) {
            uploadHandler();
        } else {
            console.log('User clicked Cancel, upload cancelled.')
            input.addEventListener('change', changeHandler)
        }
    })
}