const buffers = []

onmessage = (e) => {
    const data = e.data
    switch (data.type) {
        case 'data':
            buffers.push(data.left, data.right)
            break
        case 'end':
            finish(data.id)
            break
    }
}


function finish (id) {
    const chunkSize = buffers.length > 0 ? buffers[0].byteLength / 4 : 0
    const bufSize = chunkSize * buffers.length / 2
    const left = new Float32Array(bufSize)
    const right = new Float32Array(bufSize)
    let ptr = 0
    for(let i = 0; i < buffers.length; i += 2) {
        left.set(new Float32Array(buffers[i]), ptr)
        right.set(new Float32Array(buffers[i+1]), ptr)
        ptr += chunkSize
    }

    buffers.length = 0
    postMessage({
        id,
        left: left.buffer,
        right: right.buffer
    }, [left.buffer, right.buffer])
}
