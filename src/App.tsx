import "./App.css"
import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import gsap from 'gsap'
import color from './static/textures/door/color.jpg'
import minecraft from './static/textures/minecraft.png'
import alpha from './static/textures/door/alpha.jpg'
import height from './static/textures/door/height.jpg'
import normal from './static/textures/door/normal.jpg'
import ambientOcclusion from './static/textures/door/ambientOcclusion.jpg'
import metalness from './static/textures/door/metalness.jpg'
import roughness from './static/textures/door/roughness.jpg'

function App() {
  const [gui, setGui] = useState(new dat.GUI())
  useEffect(() => {
    const debugObject = {
      color: "#ff0000",
      spin: () => { },
    }


    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const aspectRatio = sizes.width / sizes.height

    /*
     * Textures
     */
    const loadingManager = new THREE.LoadingManager()

    loadingManager.onStart = () => {
      console.log("onStart")
    }

    loadingManager.onLoad = () => {
      console.log("onLoad")
    }

    loadingManager.onProgress = () => {
      console.log("onProgress")
    }
    loadingManager.onError = () => {
      console.log("onError")
    }

    const textureLoader = new THREE.TextureLoader(loadingManager)
    const colorTexture = textureLoader.load(minecraft)
    const doorColorTexture = textureLoader.load(color)
    const doorAlphaTexture = textureLoader.load(alpha)
    const doorHeightTexture = textureLoader.load(height)
    const doorNormalTexture = textureLoader.load(normal)
    const doorAmbientOcclusionTexture = textureLoader.load(ambientOcclusion)
    const doorMetalnessTexture = textureLoader.load(metalness)
    const doorRoughnessTexture = textureLoader.load(roughness)
    const matcapTexture = textureLoader.load("./static/textures/matcaps/1.png")
    const gradientTexture = textureLoader.load("./static/textures/gradients/3.jpg")

    // colorTexture.repeat.x = 2
    // colorTexture.repeat.y = 3
    // colorTexture.wrapS = THREE.MirroredRepeatWrapping
    // colorTexture.wrapT = THREE.RepeatWrapping

    // colorTexture.offset.x = 0.5
    // colorTexture.offset.y = 0.5

    // colorTexture.rotation = Math.PI * 0.25
    // Need to move the center point
    // colorTexture.center.x = 0.5
    // colorTexture.center.y = 0.5

    // Very Sharp
    // colorTexture.minFilter = THREE.NearestFilter
    // for minFilter == NearestFilter, mipmap is not needed
    // This would save some memory, but render might be heavier?
    // colorTexture.generateMipmaps = false
    colorTexture.magFilter = THREE.NearestFilter


    /*
     * Base
     */
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()


    /**
     * Object
     */
    const material = new THREE.MeshBasicMaterial()
    material.map = doorColorTexture
    // material.color = 'red' // This does not work
    material.color = new THREE.Color("yellow")
    // material.wireframe = true
    
    material.transparent = true // this needs to be true for opacity / alphamap
    // material.opacity = 0.5
    material.alphaMap = doorAlphaTexture

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      material
    )
    sphere.position.x = -1.5

    scene.add(sphere)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      material
    )
    scene.add(plane)

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 16, 32),
      material
    )
    torus.position.x = 1.5
    scene.add(torus)

    // First argument is field of view, 180 it will break
    // Second argument is aspect ratio
    // Third: near, lower threshold
    // Fourth: far, farther threhold
    // Dont use extreme values. They introduce z-fighting
    const camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)


    // left, right, top, bottom, then near, far
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   0.1, 100
    // )

    // Add Axes helper (red, green, blue)
    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)


    if (canvas) {
      const controls = new OrbitControls(camera, canvas)
      controls.enableDamping = true
      // controls.target.y = 2


      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      const clock = new THREE.Clock()

      window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)

      })


      window.addEventListener('dblclick', () => {
        const fullScreenElement = document.fullScreenElement || document.webkitFullscreenElement
        if (!fullScreenElement) {
          if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
          } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          }
        }

      })

      /*
       * Debug
       */
      // TODO: Remove it from useEffect, it is running multiple times
      debugObject.spin = () => {
        gsap.to(sphere.rotation, { duration: 1, y: sphere.rotation.y + 10 })
      }
      gui.add(sphere.position, "x").min(-3).max(3).step(0.01).name("Reb blob x")
      gui.add(sphere.position, "y", -3, 3, 0.01)
      gui.add(sphere.position, "z", -3, 3, 0.01)

      gui.add(sphere, "visible")
      gui.add(material, "wireframe")

      gui.addColor(debugObject, "color").onChange((newColor) => {
        debugObject.color = newColor
        material.color.set(newColor)
      })

      gui.add(debugObject, 'spin')

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        sphere.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime
        plane.rotation.y = 0.1 * elapsedTime

        // updateCamera
        // camera.rotation.y = cursor.x
        // camera.rotation.x = cursor.y
        // const amplitude = Math.PI * 2
        // camera.position.x = Math.sin(cursor.x * amplitude) * 3
        // camera.position.y = cursor.y * 5
        // camera.position.z = Math.cos(cursor.x * amplitude) * 3

        // Update controls
        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)

      }
      tick()
    }


  }, [])

  return (
    <canvas className="webgl">
    </canvas>
  )
}

export default App
