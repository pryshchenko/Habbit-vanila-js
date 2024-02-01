let habbits = [
	{
		"id": 1,
		"icon": "strong",
		"name": "Гантеля",
		"header": "Отжимания",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
		],
		"target": 10
	},
	{
		"id": 2,
		"icon": "water",
		"name": "Вода",
		"header": "Плаванье",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
		],
		"target": 10
	},
	{
		"id": 3,
		"icon": "food",
		"name": "Еда",
		"header": "Правильное питание",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
			{
				comment: 'Третий подход всегда даётся тяжело'
			}
		],
		"target": 10
	}
]

const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId = 1

const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressNum: document.querySelector('.progress__text_procent'),
		progressBar: document.querySelector('.progress__bar_cover')
	},
	content: {
		daysContainer: document.querySelector('#days'),
		nextDay: document.querySelector('.tasks__day')
	}
}

function loadData() {
	const habbitsString = localStorage.getItem(HABBIT_KEY)
	const habbitArr = JSON.parse(habbitsString)
	if (Array.isArray(habbitArr)) {
		habbits = habbitArr
	}
}

function saveData() {
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

function rerenderMenu(activeHabbit) {
	for (const habbit of habbits) {
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
		if (!existed) {
			const element = document.createElement('button')
			element.setAttribute('menu-habbit-id', habbit.id)
			element.classList.add('menu__item')
			element.addEventListener('click', () => rerender(habbit.id))
			element.innerHTML = `<img src="./img/${habbit.icon}.svg" alt="${habbit.name}" />`
			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active')
			}
			page.menu.append(element)
			continue
		}
		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active')
		} else existed.classList.remove('menu__item_active')
	}
	localStorage.setItem('active', globalActiveHabbitId)
	document.querySelector('.comment__text').classList.remove('error')
}

function rerenderHead(activeHabbit) {
	page.header.h1.textContent = activeHabbit.header
	const progress = activeHabbit.days.length / activeHabbit.target > 1
		? 100
		: activeHabbit.days.length / activeHabbit.target * 100
	page.header.progressNum.textContent = progress.toFixed(0) + '%'
	page.header.progressBar.style.width = `${progress}%`
}

function rerenderContent(activeHabbit) {
	page.content.daysContainer.innerHTML = ''
	for (const index in activeHabbit.days) {
		const element = document.createElement('div')
		element.classList.add('tasks')
		element.innerHTML = `
		<div class="tasks__day">День ${Number(index) + 1}</div>
		<div class="tasks__info">
			<div class="tasks__info_text">
				${activeHabbit.days[index].comment}
			</div>
		<img 
			class="delete" 
			src="./img/delete.svg" 
			alt="удалить" 
			onclick="deleteTask(${index})"
		/>
		</div>
		`
		page.content.daysContainer.append(element)

	}
	page.content.nextDay.textContent = `День ${activeHabbit.days.length + 1}`

}

function addDays(e) {
	e.preventDefault()
	const data = validationAndGetDataForm(e.target, ['comment'])
	if (!data) {
		return
	}
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			return {
				...habbit,
				days: habbit.days.concat([{ comment: data.comment }])
			}
		}
		return habbit
	})
	resetForm(e.target, ['comment'])
	rerender(globalActiveHabbitId)
	saveData()
}

function deleteTask(index) {
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			habbit.days.splice(index, 1)
			return {
				...habbit,
				days: habbit.days
			}
		}
		return habbit
	})
	rerender(globalActiveHabbitId)
	saveData()
}

function togglePopup() {
	const cover = document.querySelector('.cover')
	if (cover.classList.contains('cover_hidden')) {
		cover.classList.remove('cover_hidden')
	} else cover.classList.add('cover_hidden')
}

function setIcon(context, icon) {
	const inputIcon = document.getElementById('setIcon')
	inputIcon.value = icon
	const activeIcon = document.querySelector('.active__select_image')
	activeIcon.classList.remove('active__select_image')
	context.classList.add('active__select_image')
}

function addHabbit(e) {
	e.preventDefault()
	const data = validationAndGetDataForm(e.target, ['name', 'icon', 'target'])
	if (!data) {
		return
	}
	const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id , 0)
	habbits.push({
		id: maxId + 1,
		header: data.name,
		target: data.target,
		icon: data.icon,
		days: []
	})

	saveData()
	togglePopup()
	resetForm(e.target, ['name', 'target'])
	rerender(maxId + 1)
}

function resetForm(form, fields) {
	for (const field of fields) {
		form[field].value = '' 
	}
}

function validationAndGetDataForm(form, fields) {
	const formData = new FormData(form)
	let res = {}
	for (const field of fields) {
		const fieldValue = formData.get(field)
		form[field].classList.remove('error')
		if (!fieldValue) {
			form[field].classList.add('error')
		}
		res[field] = fieldValue
	}
	let isValid = true
	for (const field of fields) {
		if (!res[field]) {
			isValid = false
		}
	}
	if (!isValid) {
		return
	}
	return res
}

// function deleteHabbit() {
// 	habbits = habbits.filter(habbit => habbit.id !== globalActiveHabbitId)
// 	saveData()
// 	rerender(1)
// }    


function rerender(activeHabbitId) {
	globalActiveHabbitId = activeHabbitId
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId)
	if (!activeHabbit) {
		return
	}
	rerenderMenu(activeHabbit)
	rerenderHead(activeHabbit)
	rerenderContent(activeHabbit)
}

(() => {
	loadData()
	rerender(localStorage.getItem('active') ? Number(localStorage.getItem('active')) : 1)
})()