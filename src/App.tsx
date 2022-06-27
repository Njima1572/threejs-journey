import { useEffect } from 'react'
import * as THREE from 'three'

function App() {

  useEffect(() => {
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)
    // mesh.position.x = 1 // Should move right for a unit
    // mesh.position.y = -1 // Should move down for a unit
    // mesh.position is type of Vector3 : https://threejs.org/docs/#api/en/math/Vector3

    // alternatively
    mesh.position.set(1, 0, 1)
    scene.add(mesh)

    // Changes after adding the mesh to scene, also applies as long as it is before render
    mesh.scale.x = 2

    // TO rotate, we can use either rotation or quaternion
    // Uses 2pi = 360
    // The order matters
    mesh.rotation.reorder("XYZ") // Defaults to XYZ and do it before changing rotation
    mesh.rotation.x = Math.PI / 2 // should be 60 degrees by x axis
    mesh.rotation.y = Math.PI / 4 // should be 60 degrees by x axis
    mesh.rotation.z = Math.PI / 4 // should be 60 degrees by x axis

    // OR use quaternion instead to avoid gimbal lock

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

    // distanceTo is Vector3 to Vector3
    console.log(mesh.position.distanceTo(camera.position)) // non-trivial, useable line for some use

    console.log(camera.position, camera.rotation)
    camera.lookAt(mesh.position) // Changes the orientation of camera to look at mesh.position
    console.log(camera.position, camera.rotation) // Position does not change

    // console.log(mesh.position.length())
    // mesh.position.normalize() // Shrink / expand until the length is 1
    // console.log(mesh.position.length()) // Should be 1

    if (canvas) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.render(scene, camera)
    }

  }, [])

  return (
    <canvas className="webgl">
    </canvas>
  )
}

export default App
