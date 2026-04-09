const axios = require("axios");

async function run() {
  try {
    // 1. Fetch CSRF token
    const csrfRes = await axios.get("http://localhost:8080/api/v1/csrf-token");
    let cookie = "";
    if (csrfRes.headers["set-cookie"]) {
        cookie = csrfRes.headers["set-cookie"][0];
    }
    let csrfToken = "";
    if (cookie) {
        csrfToken = cookie.split(";")[0].split("=")[1];
    }
    console.log("CSRF Token:", csrfToken);

    // 2. Login
    const loginRes = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      {
        email: "admin@eazystore.com",
        password: "Admin7013"
      },
      {
        headers: {
          "X-XSRF-TOKEN": csrfToken,
          "Cookie": cookie
        }
      }
    );
    const jwt = loginRes.headers["authorization"].split(" ")[1];
    console.log("JWT Token snippet:", jwt.substring(0, 10));

    // 3. Fetch orders just to see what ID is available
    const ordersRes = await axios.get(
        "http://localhost:8080/api/v1/admin/orders",
        {
          headers: {
            "Cookie": cookie,
            "Authorization": `Bearer ${jwt}`
          }
        }
      );
      
      if (ordersRes.data.length === 0) {
        console.log("No orders found to confirm.");
        return;
      }
      
      const orderId = ordersRes.data[0].orderId;
      console.log("Trying to confirm Order ID:", orderId);

    // 4. Patch order
    const patchRes = await axios.patch(
      `http://localhost:8080/api/v1/admin/orders/${orderId}/confirm`,
      {},
      {
        headers: {
          "X-XSRF-TOKEN": csrfToken,
          "Cookie": cookie,
          "Authorization": `Bearer ${jwt}`
        }
      }
    );

    console.log("Patch Success:", patchRes.data);

  } catch (error) {
    if (error.response) {
      console.log("------------------------");
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
      console.log("------------------------");
    } else {
      console.log("Error:", error.message);
    }
  }
}

run();
