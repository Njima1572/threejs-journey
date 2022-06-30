import "./App.css"
import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

function App() {

  useEffect(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const aspectRatio = sizes.width / sizes.height

    // const cursor = {
    //   x: 0,
    //   y: 0
    // }

    // window.addEventListener('mousemove', (event) => {
    //   cursor.x = event.clientX / sizes.width - 0.5
    //   cursor.y = -(event.clientY / sizes.height - 0.5)
    //   console.log(cursor)
    // })

    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()

    // const group = new THREE.Group()
    // scene.add(group)

    // const cube1 = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1, 2, 2, 3),
    //   new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // )
    // const cube2 = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // )
    // const cube3 = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    // )
    // cube2.position.x = -2
    // cube3.position.x = 2

    // group.add(cube1)
    // group.add(cube2)
    // group.add(cube3)

    const geometry = new THREE.BufferGeometry()
    const count = 50
    // 3 coordinates for 3 points
    const positionsArray = new Float32Array(count * 3 * 3)

    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4
    }

    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
    geometry.setAttribute("position", positionsAttribute)


    const material = new THREE.MeshBasicMaterial({ color: 0xff2233, wireframe: true })
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
