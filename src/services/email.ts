import emailjs from "emailjs-com";

export const sendEmail = (code: string) => {
  emailjs
    .send(
      "service_vmjsgwd",       // your service ID
      "template_lv17ppr",      // your template ID
      { name: code, email : "dinanthemika.personal@gmail.com" }, // variables defined in your template
      "9pgUINS-d_b8ROQz9"      // your public key
    )
    .then(
      (result) => {
        console.log("Success:", result.text);
      },
      (error) => {
        console.log("Error:", error.text);
      }
    );
};
