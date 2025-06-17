export function process(store, order) {
    // Копия склада, чтобы не мутировать исходный
    const storeMap = new Map();
    for (const { size, quantity } of store) {
      storeMap.set(size, quantity);
    }
  
    const assignment = [];
    const statsMap = new Map();
    let mismatches = 0;
  

    const singleSizeOrders = order.filter(o => o.size.length === 1);
    const multiSizeOrdersS2 = order.filter(o => o.size.length === 2 && o.masterSize === "s2");
    const multiSizeOrdersS1 = order.filter(o => o.size.length === 2 && o.masterSize === "s1");
    const sortedOrders = [...singleSizeOrders, ...multiSizeOrdersS2, ...multiSizeOrdersS1];
  
    for (const person of sortedOrders) {
      const sizes = person.size;
      let chosenSize = null;
      let isMismatch = false;
  
      if (sizes.length === 1) {
        const size = sizes[0];
        if ((storeMap.get(size) || 0) > 0) {
          chosenSize = size;
        }
      } else {
        const [s1, s2] = sizes;
        const priority = person.masterSize;
  
        const firstChoice = priority === "s1" ? s1 : s2;
        const secondChoice = priority === "s1" ? s2 : s1;
  
        if ((storeMap.get(firstChoice) || 0) > 0) {
          chosenSize = firstChoice;
        } else if ((storeMap.get(secondChoice) || 0) > 0) {
          chosenSize = secondChoice;
          isMismatch = true;
        }
      }
  
      if (chosenSize == null) {
        return false;
      }
  
      storeMap.set(chosenSize, storeMap.get(chosenSize) - 1);
      assignment.push({ id: person.id, size: chosenSize });
  
      statsMap.set(chosenSize, (statsMap.get(chosenSize) || 0) + 1);
  
      if (isMismatch) {
        mismatches++;
      }
    }
  
    const stats = Array.from(statsMap.entries())
      .map(([size, quantity]) => ({ size, quantity }))
      .sort((a, b) => a.size - b.size);
  
    return {
      stats,
      assignment,
      mismatches
    };
  }
  
  