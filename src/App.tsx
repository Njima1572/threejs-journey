import "./App.css"
import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
console.log(typefaceFont)
import gsap from 'gsap'

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
     * Base
     */
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()

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




    /*
     * Fonts
     */
    const fontLoader = new FontLoader()
    const font = fontLoader.parse(typefaceFont)
    const textGeometry = new TextGeometry(
      "Hello Three.js",
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 3
      }
    )

    textGeometry.computeBoundingBox()
    console.log(textGeometry.boundingBox)


    const textMaterial = new THREE.MeshBasicMaterial()
    textMaterial.wireframe = true
    const text = new THREE.Mesh(
      textGeometry,
      textMaterial
    )
    scene.add(text)


    /**
     * Object
     */

    const material = new THREE.MeshStandardMaterial()

    material.side = THREE.DoubleSide

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      material
    )
    sphere.position.x = -1.5
    sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

    // scene.add(sphere)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 64, 64),
      material
    )
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
    // scene.add(plane)

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
      material
    )
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
    torus.position.x = 1.5
    // scene.add(torus)

    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.x = 3
    pointLight.position.x = 4

    scene.add(pointLight)

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
      // gui.add(material, "wireframe")

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

        sphere.rotation.x = 0.15 * elapsedTime
        torus.rotation.x = 0.15 * elapsedTime
        plane.rotation.x = 0.15 * elapsedTime

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
