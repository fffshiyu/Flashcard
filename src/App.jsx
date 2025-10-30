import React, { useState, useMemo, useRef, useEffect, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

// 单个卡片的 3D 包装器 - 使用双面材质
const Card3DWrapper = memo(function Card3DWrapper({ position, cardData, onClick, isSelected, isHidden, shakingKey }) {
  const groupRef = useRef()
  const targetPosition = useRef(new THREE.Vector3(...position))
  const targetScale = useRef(1)
  const targetRotation = useRef(0)
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    if (isSelected) {
      // 选中时稍微放大并远离相机一些，跟随相机的 y 位置，不翻转
      const cameraY = state.camera.position.y
      targetPosition.current.set(0, cameraY, 2)
      targetScale.current = 1.3
      targetRotation.current = 0 // 不翻转，保持正面
    } else {
      targetPosition.current.set(...position)
      targetScale.current = 1
      targetRotation.current = 0
    }
    
    // 平滑插值
    groupRef.current.position.lerp(targetPosition.current, delta * 6)
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
      delta * 6
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      delta * 6
    )
    
    // 隐藏效果
    if (isHidden) {
      groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 8)
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {/* 正面 - 米白色 - 始终显示 */}
      <Html
        transform
        occlude={false}
        distanceFactor={0.9}
        position={[0, 0, 0.02]}
        style={{
          width: '800px',
          height: '600px',
          pointerEvents: isSelected ? 'none' : 'auto',
        }}
      >
        <div 
          className="cardFace front"
          onClick={onClick}
          style={{ 
            cursor: isSelected ? 'default' : 'pointer',
            width: '800px',
            height: '600px',
          }}
        >
          <img src="star-outline-1.png" alt="star" className="starIcon" />
          <div className="cardTitle">{cardData.front}</div>
        </div>
      </Html>
    </group>
  )
})

function WheelCameraScroller({ rows }) {
  const { camera } = useThree()
  const targetYRef = useRef(0)

  // 与布局保持一致的参数
  const cameraZ = 6
  const fov = 50
  const rowSpacing = 1.5
  const topPaddingForScroll = 2
  const bottomPaddingForScroll = 2
  const bottomGuard = 1.0 // 距离底部保留的缓冲
  const viewportHeight = 2 * cameraZ * Math.tan((fov * Math.PI) / 360)
  const totalHeight = topPaddingForScroll + Math.max(0, rows - 1) * rowSpacing + bottomPaddingForScroll
  const maxCamShift = Math.max(0, totalHeight - viewportHeight + bottomGuard)

  useEffect(() => {
    // 监听整个窗口的滚轮事件，这样无论鼠标在哪里都能滚动
    const onWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY
      const next = targetYRef.current - delta * 0.0025
      targetYRef.current = Math.min(0, Math.max(-maxCamShift, next))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [maxCamShift])

  useFrame(() => {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetYRef.current, 0.12)
    camera.updateProjectionMatrix()
  })

  return null
}

function App() {
  const cards = useMemo(() => {
    const knowledgeBase = [
      { front: 'What is React?', back: 'A JavaScript library for building user interfaces, maintained by Meta and the community.' },
      { front: 'What is Figma?', back: 'A collaborative browser-based interface design tool for creating UI/UX designs.' },
      { front: 'What is CSS Grid?', back: 'A two-dimensional layout system for the web that handles both columns and rows.' },
      { front: 'What is an API?', back: 'Application Programming Interface - allows different software systems to communicate with each other.' },
      { front: 'What is JavaScript?', back: 'A high-level programming language that enables interactive web experiences and runs in browsers.' },
      { front: 'What is HTML?', back: 'HyperText Markup Language - the standard markup language for structuring content on the web.' },
      { front: 'What is TypeScript?', back: 'A superset of JavaScript that adds static typing and advanced features for better code quality.' },
      { front: 'What is Git?', back: 'A distributed version control system for tracking changes in code and enabling team collaboration.' },
      { front: 'What is Node.js?', back: 'A JavaScript runtime built on Chrome V8 engine that allows JavaScript to run on the server side.' },
      { front: 'What is REST API?', back: 'Representational State Transfer - an architectural style for designing networked applications using HTTP.' },
      { front: 'What is GraphQL?', back: 'A query language for APIs that provides efficient and flexible data fetching from servers.' },
      { front: 'What is Docker?', back: 'A platform for developing, shipping, and running applications in isolated containers.' },
      { front: 'What is Kubernetes?', back: 'An open-source system for automating deployment, scaling, and management of containerized applications.' },
      { front: 'What is MongoDB?', back: 'A NoSQL document database that stores data in flexible, JSON-like documents.' },
      { front: 'What is PostgreSQL?', back: 'A powerful open-source relational database system known for reliability and feature robustness.' },
      { front: 'What is Redis?', back: 'An in-memory data structure store used as database, cache, and message broker for fast data access.' },
      { front: 'What is Webpack?', back: 'A static module bundler for JavaScript applications that processes and bundles code efficiently.' },
      { front: 'What is CI/CD?', back: 'Continuous Integration and Continuous Deployment - practices that automate testing and deployment pipelines.' },
      { front: 'What is Three.js?', back: 'A JavaScript 3D library that makes WebGL easier to use for creating 3D graphics in the browser.' },
      { front: 'What is React Fiber?', back: 'React\'s reconciliation algorithm that enables incremental rendering and better performance.' },
      { front: 'What is WebGL?', back: 'Web Graphics Library - a JavaScript API for rendering 2D and 3D graphics in web browsers.' },
      { front: 'What is JSON?', back: 'JavaScript Object Notation - a lightweight data interchange format that is easy to read and write.' },
      { front: 'What is OAuth?', back: 'An open standard for access delegation used for secure authorization in web applications.' },
      { front: 'What is AWS?', back: 'Amazon Web Services - a comprehensive cloud computing platform offering various infrastructure services.' },
    ]
    return knowledgeBase.map((card, i) => ({ ...card, id: i }))
  }, [])

  const [flipped, setFlipped] = useState(new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [remembered, setRemembered] = useState(new Set())
  const [removing, setRemoving] = useState(null)
  const [shakingKey, setShakingKey] = useState(0)

  // 计算网格位置 (5行4列) - 再次缩小卡片间距，并为第一行加入顶部留白
  const getGridPosition = (index) => {
    const col = index % 4
    const row = Math.floor(index / 4)
    const x = (col - 1.5) * 2 
    const topPadding = 2 // 顶部偏移
    const y = -(row - 2) * 1.5 - topPadding 
    return [x, y, 0]
  }

  const openCard = (id) => {
    setSelectedId(id)
    setFlipped((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const closeCard = () => {
    setSelectedId(null)
  }

  const markRemembered = (id) => {
    setRemoving(id)
    setTimeout(() => {
      setRemembered((prev) => new Set([...prev, id]))
      closeCard()
      setRemoving(null)
      setShakingKey(prev => prev + 1)
    }, 300)
  }

  const markForgotten = (id) => {
    setTimeout(() => closeCard(), 300)
  }

  const selectedCard = selectedId !== null ? cards.find(c => c.id === selectedId) : null

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#191919', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: '#191919' }}
        dpr={[1, 2]} // 性能优化：限制像素比
        performance={{ min: 0.5 }} // 性能优化：降低帧率阈值
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        {(() => {
          const visible = cards.filter(c => !remembered.has(c.id))
          const rows = Math.max(1, Math.ceil(visible.length / 4))
          return <WheelCameraScroller rows={rows} />
        })()}

        {cards
          .filter(c => !remembered.has(c.id))
          .map((card, index) => (
            <Card3DWrapper
              key={`${card.id}-${shakingKey}`}
              position={getGridPosition(index)}
              cardData={card}
              onClick={() => openCard(card.id)}
              isSelected={selectedId === card.id}
              isHidden={remembered.has(card.id)}
              shakingKey={shakingKey}
            />
          ))}
      </Canvas>

      {/* 点击背景关闭卡片 */}
      {selectedCard && (
        <div 
          className="overlay" 
          onClick={closeCard}
          style={{ 
            pointerEvents: 'auto',
            background: 'transparent'
          }}
        />
      )}
    </div>
  )
}

export default App
