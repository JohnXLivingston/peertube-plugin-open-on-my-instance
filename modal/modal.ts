interface Window {
  initModal: () => Promise<void>
}

async function getSavedIntances (): Promise<string[]> {
  try {
    const json: string = window.localStorage.getItem('open-on-my-instance-saved-instances') ?? '[]'
    const instances = JSON.parse(json)
    if (Array.isArray(instances)) {
      return instances
    }
  } catch {}
  return []
}

async function refreshSavedInstances (container: HTMLUListElement): Promise<void> {
  console.debug('Refreshing the saved instance list...')
  container.innerHTML = ''
  const savedInstances = await getSavedIntances()
  for (const savedInstance of savedInstances) {
    console.debug('Another item: ' + savedInstance)
    const li = document.createElement('li')
    li.innerText = savedInstance
    container.append(li)
  }
}

async function saveInstance (url: string): Promise<void> {
  let json: string = window.localStorage.getItem('open-on-my-instance-saved-instances') ?? '[]'
  const instances: string[] = JSON.parse(json)
  if (instances.includes(url)) {
    return
  }
  instances.push(url)
  json = JSON.stringify(instances.sort())
  window.localStorage.setItem('open-on-my-instance-saved-instances', json)
}

window.initModal = async function initModal (): Promise<void> {
  console.debug('Entering in initModal...')
  const instanceFormContainer: HTMLFormElement | null = document.querySelector('[instance_form]')
  const savedInstancesContainer: HTMLUListElement | null = document.querySelector('[saved_instances]')
  if (!instanceFormContainer || !savedInstancesContainer) {
    throw "Missing DOM elements"
  }

  instanceFormContainer.onsubmit = () => {
    (async () => {
      const field: HTMLInputElement | null = instanceFormContainer.querySelector('input[type=url]')
      const url: string | null | undefined = field?.value
      if (url) {
        await saveInstance(url)
        await refreshSavedInstances(savedInstancesContainer)
      }
    })()
    return false
  }

  await refreshSavedInstances(savedInstancesContainer)
}
