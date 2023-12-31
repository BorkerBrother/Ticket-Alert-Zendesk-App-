var client = getClient();

async function updateIconCount(delayInMillis) {
  const count = await getCount();

  if (count > 9) {
    setTopBarIcon("count-9plus");
  } else if (count === 0) {
    setTopBarIcon("default");
  } else {
    setTopBarIcon(`count-${count}`);
  }
  await new Promise((resolve) => setTimeout(resolve, delayInMillis));
  await updateIconCount(delayInMillis);
}

// In prod, update this function to call a
// third-party API using ZAF's client.request() method
async function getCount() {
  // Hier nehmen wir an, dass jedes Ticket ein Element mit der Klasse "ticket" ist.
  const ticketElements = document.getElementsByClassName("ticket");
  const count = ticketElements.length;

  return count;
}

async function setTopBarIcon(symbol) {
  const topBar = await getTopBarInstance();
  topBar.set("iconSymbol", symbol);
}

async function getTopBarInstance() {
  const instancesData = await client.get("instances");
  const instances = Object.values(instancesData.instances);
  const topBar = instances.find((e) => e.location === "top_bar");
  return client.instance(topBar.instanceGuid);
}


