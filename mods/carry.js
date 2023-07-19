let carriees = []
const display = new Display();

function render() {
    let carryString = ""
    for (let i = 0;i<carriees.length;i++) {
        carryString += "\n" + "IGN: " + carriees[i][0] + " Runs: " + carriees[i][1] + "/" + carriees[i][2]
    }

    display.clearLines()
    display.setLine(0, carryString);
    display.setRenderLoc(0,250)
}

register("command", (...args) => {
    if (args[0]) {
        if (args[1]) {
            carriees.push([args[0], 0, args[1]])
            render()
        }
    }
}).setName("register")

register("command", (...args) => {
    if (args[0]) {
        for (let i = 0;i<carriees.length;i++) {
            if (carriees[i][0] == args[0]) {
                carriees.splice(i,1)
            }
        }
        render()
    } else {
        carriees = []
        display.clearLines()
    }
}).setName("clear")

register("command", (...args) => {
    if (args[0]) {
        for (let i = 0;i<carriees.length;i++) {
            if (carriees[i][0] == args[0]) {
                carriees[i][1] += 1 
                render()
            }
        }
    } else {
        for (let i = 0;i<carriees.length;i++) {
            carriees[i][1] += 1
        }
        render()
    }
}).setName("add")

register("command", (...args) => {
    if (args[0]) {
        for (let i = 0;i<carriees.length;i++) {
            if (carriees[i][0] == args[0]) {
                carriees[i][1] -= 1 
                render()
            }
        }
    } else {
        for (let i = 0;i<carriees.length;i++) {
            carriees[i][1] -= 1
        }
        render()
    }
}).setName("sub")

register("command", (...args) => {
    if (args[0]) {
        if (args[1]) {
            for (let i = 0;i<carriees.length;i++) {
                if (carriees[i][0] == args[0]) {
                    carriees[i][2] = args[1]
                    render()
                }
            }
        }
    }
}).setName("edit")

register("chat", event => {
    for (let i = 0;i<carriees.length;i++) {
        carriees[i][1] += 1
    }
    render()
}).setChatCriteria("> EXTRA STATS <").setContains()
