import { useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

function App() {

  useEffect(() => {
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()

    const group = new THREE.Group()
    scene.add(group)

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    )
    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    )

    cube2.position.x = -2
    cube3.position.x = 2

    group.add(cube1)
    group.add(cube2)
    group.add(cube3)

    group.rotation.x = 1



    const sizes = {
      width: 800,
      height: 600
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.x = 0.5
    camera.position.y = 0.5
    camera.position.z = 3
    scene.add(camera)

    // Add Axes helper (red, green, blue)
    const axesHelper = new THREE.AxesHelper()
    scene.add(axesHelper)


    if (canvas) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)

      // gsap has its own tick, but needs render.renderer
      gsap.to(group.position, { duration: 1, delay: 1, x: 1 })
      gsap.to(group.position, { duration: 1, delay: 2, x: 0 })

      const clock = new THREE.Clock()

      // Animations
      const tick = () => {
        // Time
        const elapsedTime = clock.getElapsedTime()
        // DONT use getDelta
        group.rotation.x = elapsedTime * Math.PI / 4
        camera.position.x = Math.cos(elapsedTime)
        camera.position.y = Math.sin(elapsedTime)
        camera.lookAt(group.position)
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
