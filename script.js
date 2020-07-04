var app = new Vue({
  el: "#app",
  data: {
    user: null,
    price: (0).toFixed(3),
    balance: (0).toFixed(3),
    transcationHistory: [],
  },
  methods: {
    authenticateUser: function () {
      const PiNetworkClient = window.PiNetwork;
      const authenticateUser = async (PiNetworkClient) => {
        const user = await PiNetworkClient.Authenticate();
        this.user = user;
      };
      authenticateUser(PiNetworkClient);
      this.getUserBalance();
    },
    requestTransfer: function () {
      const PiNetworkClient = window.PiNetwork;
      const requestTransfer = async (PiNetworkClient, price) => {
        const transferRequest = await PiNetworkClient.RequestTransfer(
          price,
          "Demo transfer request"
        );
        if (transferRequest.status === "succeeded") {
          iziToast.success({
            timeout: 10000,
            title: "Success",
            position: "bottomRight",
            message: "Request Successfully Sent!",
          });
        } else {
          iziToast.error({
            timeout: 10000,
            position: "topRight",
            title: "Failed",
            message: "Request Failed due to some Error!",
          });
        }
        const requestedData = {
          from_username: transferRequest.from_username,
          to_username: transferRequest.to_username,
          reason: transferRequest.reason,
          amount: +Math.abs(transferRequest.amount),
          created_at: transferRequest.created_at,
          type: "Request",
          status: transferRequest.status,
        };
        this.transcationHistory.push(requestedData);
        console.log("transferRequest: ", transferRequest);
        console.log("PiNetworkClient: ", PiNetworkClient);
      };
      requestTransfer(PiNetworkClient, parseFloat(this.price));
      this.price = (0).toFixed(3);
      this.getUserBalance();
    },
    getUserBalance: function () {
      const getBalance = async (PiNetworkClient) => {
        const userBalance = await PiNetworkClient.Balance();
        this.balance = parseFloat(userBalance.balance).toFixed(3);
      };
      const PiNetworkClient = window.PiNetwork;
      getBalance(PiNetworkClient);
    },
    rewardUser: function () {
      const reward = async (PiNetworkClient) => {
        const reus = await PiNetworkClient.RewardUser();
        reus.amount = -Math.abs(reus.amount);
        reus.type = "Reward";
        if (reus.status === "succeeded") {
          iziToast.success({
            timeout: 10000,
            title: "Success",
            position: "bottomRight",
            message: "Rewarded Successfully!",
          });
        } else {
          iziToast.error({
            timeout: 10000,
            title: "Failed",
            position: "topRight",
            message: "Reward Failed due to some Error!",
          });
        }
        this.transcationHistory.push(reus);
      };
      const PiNetworkClient = window.PiNetwork;
      reward(PiNetworkClient);
      this.getUserBalance();
    },
    openAppConversation: function () {
      const openAppCon = async (PiNetworkClient) => {
        const reus = await PiNetworkClient.OpenAppConversation();
        console.log("OpenAppConversation: ", reus);
      };
      const PiNetworkClient = window.PiNetwork;
      openAppCon(PiNetworkClient);
      this.getUserBalance();
    },
  },
});
