
export function useSound(src: string) {

    const BASE_VOLUME = 0.15
    const FIREFOX_MULTIPLIER = 0.50

    let ctx: AudioContext
    let buffer: AudioBuffer
    let gain: GainNode

    onMounted(async() => {

        ctx = new AudioContext()

        gain = ctx.createGain()
        gain.gain.value = isFirefox()
            ? BASE_VOLUME * FIREFOX_MULTIPLIER
            : BASE_VOLUME
        gain.connect(ctx.destination)

        const res = await fetch(src)
        const arrayBuffer = await res.arrayBuffer()
        buffer = await ctx.decodeAudioData(arrayBuffer)
    })

    const play = () => {

        if (ctx.state === 'suspended') {
            ctx.resume()
        }

        const src = ctx.createBufferSource()
        src.buffer = buffer
        src.connect(gain)
        src.start()
    }

    return { play }
}