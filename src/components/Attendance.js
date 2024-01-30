// import React, { useState, useRef, useEffect } from 'react'

// import * as faceapi from 'face-api.js'

// export default function Attendance() {
//   const videoRef = useRef()
// 	const canvasRef = useRef()
// 	const [DetectedFace, setDetectedFace] = useState({})
// 	const [Present, setPresent] = useState([])

// 	const useTiny = true
// 	let initialized = false
// 	const inputSize = 512
// 	const scoreThreshold = 0.5
// 	const minConfidence = 0.7
// 	const label = 'Name  Prashant Amoli'
// 	const availableExpressions = ['neutral', 'happy', 'surprised']
// 	let objExpressionDescriptors = {}

// 	useEffect(() => {
// 		const loadModels = async () => {
// 			const url = process.env.PUBLIC_URL + '/models'
// 			await faceapi.loadTinyFaceDetectorModel(url)
// 			await faceapi.loadFaceLandmarkTinyModel(url)
// 			await faceapi.loadFaceExpressionModel(url)
// 			await faceapi.loadFaceRecognitionModel(url)
// 			console.log('Models loaded')
// 		}
// 		loadModels()
// 		getVideo()
// 	}, [])

// 	const dimensions = {
// 		width: 800,
// 		height: 600,
// 	}

// 	const getVideo = () => {
// 		navigator.mediaDevices
// 			.getUserMedia({ video: dimensions })
// 			.then(stream => {
// 				videoRef.current.srcObject = stream
// 			})
// 			.catch(err => {
// 				console.error('error:', err)
// 			})
// 	}

// 	const detect = async () => {
// 		// cn
// 		const refFace = await loadLabeledImages()
// 		const faceMatcher = new faceapi.FaceMatcher(refFace, minConfidence)

// 		setInterval(async () => {
// 			// .detectSingleFace(videoRef.current, new faceapi.getFaceDetectorOptions())
// 			const detection = await faceapi
// 				.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
// 				.withFaceLandmarks(useTiny)
// 				.withFaceExpressions()
// 				.withFaceDescriptor()

// 			if (detection) {
// 				const resizedDetections = faceapi.resizeResults(detection, dimensions)

// 				Object.keys(resizedDetections.expressions).forEach(key => {
// 					if (availableExpressions.indexOf(key) < 0) return // skip if other expressions
// 					if (resizedDetections.expressions[key] > minConfidence && initialized === false)
// 						if (!objExpressionDescriptors.hasOwnProperty(key)) {
// 							// console.log('Detection:', JSON.stringify(detection))
// 							// console.log('Resized Detections:', key, JSON.stringify(resizedDetections.descriptor))

// 							// check if face expression not fulfilled yet
// 							objExpressionDescriptors[key] = resizedDetections.descriptor // update fullfilled face expressions
// 							// trigger event each new expression detected

// 							if (hasAllExpressions()) {
// 								//Add to the database or compare to the database
// 								console.log(
// 									'All 3 Expressions',
// 									JSON.stringify(Object.values(objExpressionDescriptors))
// 								)
// 								console.log('Detection', detection)
// 								initialized = true

// 								// cn
// 								// const arr = [...Object.values(objExpressionDescriptors)]
// 								// const results = arr.map(d => {
// 								// 	return faceMatcher.findBestMatch(d.descriptor)
// 								// })
// 								const result = faceMatcher.findBestMatch(resizedDetections.descriptor)
// 								console.log('RESULT=>', result.toString())

// 								const options = { label: result.toString(), lineWidth: 3 }
// 								if (result) {
// 									const students = [...Present]
// 									students.unshift(` ${result.toString()} is present.`)
// 									setPresent(students)
// 									showDetections(detection, result.toString())
// 									// console.log('Present----------', JSON.stringify(Present))
// 								}

// 								const drawBox = new faceapi.draw.DrawBox(resizedDetections.detection.box, options)
// 								drawBox.draw(canvasRef.current)

// 								setDetectedFace(prev => {
// 									// Update state
// 									return { details: Object.values(objExpressionDescriptors) }
// 								})

// 								const descriptors = [...Object.values(objExpressionDescriptors)]
// 								console.log('Descriptors:::', JSON.stringify(descriptors))
								
// 							}
// 						}
// 				})
// 			}
// 			if (detection !== undefined) showDetections(detection, Present[0])
// 		}, 2000)
// 	}

// 	const hasAllExpressions = () => {
// 		return availableExpressions.every(expression => {
// 			return objExpressionDescriptors.hasOwnProperty(expression)
// 		})
// 	}

// 	function loadLabeledImages() {
// 		const labels = ['tadi'] // for WebCam
// 		return Promise.all(
// 			labels.map(async label => {
// 				const descriptions = []
// 				for (let i = 1; i < 2; i++) {
// 					const img = await faceapi.fetchImage(`infrence/${label}/${i}.jpg`)
// 					const detections = await faceapi
// 						.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
// 						.withFaceLandmarks(useTiny)
// 						.withFaceExpressions()
// 						.withFaceDescriptor()

//           if(detections){
//             console.log(i,img)
// 					  descriptions.push(detections.descriptor)
//           }
//           else{
//             console.log(label+i+" not found")
//           }
					
// 				}
// 				return new faceapi.LabeledFaceDescriptors(label, descriptions)
// 			})
// 		)
// 	}

// 	const showDetections = (detection, label) => {
// 		faceapi.matchDimensions(canvasRef.current, dimensions)
// 		const resizedDetections = faceapi.resizeResults(detection, dimensions)
// 		const minProbability = 0.05
// 		canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
// 		canvasRef.current.getContext('2d').clearRect(0, 0, dimensions.width, dimensions.height)

// 		// cc // default label
// 		const options = { label: label || 'Analyzing Face', lineWidth: 3 }
// 		const drawBox = new faceapi.draw.DrawBox(resizedDetections.detection.box, options)
// 		drawBox.draw(canvasRef.current)

// 		faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
// 		faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
// 		faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections, minProbability)
// 	}
// 	const addStudent = async descriptors => {
// 		let db

// 		if (localStorage.getItem('db') == null) {
// 			console.log('NO db')
// 			db = []
// 			localStorage.setItem('db', JSON.stringify(db))
// 		}
// 		// db = JSON.parse(localStorage.getItem('db'))

// 		console.log('db status', JSON.parse(localStorage.getItem('db')))

// 		if (db != null) {
// 			let label = await prompt('Enter your username', 'Prashant')
// 			const data = { label: label, descriptors: JSON.stringify(descriptors) }
// 			db.push(data)
// 			localStorage.setItem('db', db)
// 			console.log('db updated:=>', JSON.stringify(localStorage.getItem('db')))
// 		}
// 	}

// 	function List() {
// 		return <ol>{() => Present.map(name => <li key={name}>{name} is present.</li>)}</ol>
// 	}

// 	return (
// 			<div className="detection">
// 				<video autoPlay muted ref={videoRef} onPlay={detect} />
// 				<canvas ref={canvasRef} />
// 			</div>
// 	)
// }


// // import React, { useRef, useEffect } from 'react'
// // import * as faceapi from 'face-api.js'

// // const Attendance = () => {
// // 	const videoRef = useRef()
// // 	const canvasRef = useRef()

// // 	useEffect(() => {
// // 		const loadModels = async () => {
// // 			const url = process.env.PUBLIC_URL + '/models'
// // 			await faceapi.loadTinyFaceDetectorModel(url).then(() => console.log('T F D loaded'))
// // 			await faceapi.loadFaceLandmarkTinyModel(url).then(() => console.log('F L M loaded'))
// // 			await faceapi.loadFaceExpressionModel(url).then(() => console.log('F E M loaded'))
// // 			await faceapi.loadFaceRecognitionModel(url).then(() => console.log('F R M loaded'))
// // 		}
// // 		loadModels()
// // 		console.log('FaceApi=>', faceapi)
// // 		getVideo()
// // 	}, [])

// // 	const dimensions = {
// // 		width: 400,
// // 		height: 400,
// // 	}

// // 	const getVideo = () => {
// // 		navigator.mediaDevices
// // 			.getUserMedia({ video: { width: 400, height: 400 } })
// // 			.then(stream => {
// // 				videoRef.current.srcObject = stream
// // 			})
// // 			.catch(err => {
// // 				console.error('error:', err)
// // 			})
// // 	}

// // 	const detect = () => {
// // 		setInterval(async () => {
// // 			const useTiny = true
// // 			// .detectSingleFace(videoRef.current, new faceapi.getFaceDetectorOptions())
// // 			const detection = await faceapi
// // 				.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
// // 				.withFaceLandmarks(useTiny)
// // 				.withFaceExpressions()
// // 				.withFaceDescriptor()

// // 			// if (detection) {
// // 			// 	console.warn('Descriptor', detection.descriptor)
// // 			// 	console.warn('expressions', detection.expressions)
// // 			// }

// // 			if (detection !== undefined) {
// // 				faceapi.matchDimensions(canvasRef.current, dimensions)
// // 				const resizedDetections = faceapi.resizeResults(detection, dimensions)
// // 				const minProbability = 0.05
// // 				canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
// // 				canvasRef.current.getContext('2d').clearRect(0, 0, dimensions.width, dimensions.height)
// // 				faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
// // 				faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
// // 				faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections, minProbability)
// // 			}
// // 		}, 500)
// // 	}

// // 	const sendFace = () => {}

// // 	return (
// // 		<div className="detection">
// // 			<video autoPlay muted ref={videoRef} onPlay={detect} />
// // 			<canvas ref={canvasRef} />
// // 		</div>
// // 	)
// // }

// // export default Attendance