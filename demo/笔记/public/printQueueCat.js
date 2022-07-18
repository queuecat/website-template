$.ajax({
    url: "/getFont",
    success: (data) => {
        console.log(`%c${data}`, "color:#399c9c")
    },
    error: (err) => {
        console.error(err)
    }
})