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
    // const colorTexture = textureLoader.load(color)
    const colorTexture = textureLoader.load(minecraft)
    const alphaTexture = textureLoader.load(alpha)
    const heightTexture = textureLoader.load(height)
    const normalTexture = textureLoader.load(normal)
    const ambientOcclusionTexture = textureLoader.load(ambientOcclusion)
    const metalnessTexture = textureLoader.load(metalness)
    const roughnessTexture = textureLoader.load(roughness)

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


    const geometry = new THREE.BoxGeometry(1, 1, 1)
    console.log(geometry.attributes.uv)
    const material = new THREE.MeshBasicMaterial({
      map: colorTexture,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // First argument is field of view, 180 it will break
    // Second argument is aspect ratio
    // Third: near, lower threshold
    // Fourth: far, farther threhold
    // Dont use extreme values. They introduce z-fighting
    const camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 100)
    camera.position.z = 3
    // camera.lookAt(group.position)
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
      const gui = new dat.GUI()
      debugObject.spin = () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
      }
      gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("Reb blob x")
      gui.add(mesh.position, "y", -3, 3, 0.01)
      gui.add(mesh.position, "z", -3, 3, 0.01)

      gui.add(mesh, "visible")
      gui.add(material, "wireframe")

      gui.addColor(debugObject, "color").onChange((newColor) => {
        debugObject.color = newColor
        material.color.set(newColor)
      })

      gui.add(debugObject, 'spin')

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // updateCamera
        // camera.rotation.y = cursor.x
        // camera.rotation.x = cursor.y
        // const amplitude = Math.PI * 2
        // camera.position.x = Math.sin(cursor.x * amplitude) * 3
        // camera.position.y = cursor.y * 5
        // camera.position.z = Math.cos(cursor.x * amplitude) * 3
        // camera.lookAt(group.position)
        // group.position.x = Math.cos(elapsedTime * Math.PI / 4)

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
