import { useEffect } from 'react'
import * as THREE from 'three'

function App() {

  useEffect(() => {
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 1 // Should move right for a unit
    mesh.position.y = -1 // Should move down for a unit
    // mesh.position is type of Vector3 : https://threejs.org/docs/#api/en/math/Vector3
    
    // alternatively
    mesh.position.set(1, -1, 1)
    scene.add(mesh)

    const sizes = {
      width: 800,
      height: 600
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 3
    scene.add(camera)

    // distanceTo is Vector3 to Vector3
    console.log(mesh.position.distanceTo(camera.position)) // non-trivial, useable line for some use

    mesh.position.normalize() // Shrink / expand until the length is 1

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
