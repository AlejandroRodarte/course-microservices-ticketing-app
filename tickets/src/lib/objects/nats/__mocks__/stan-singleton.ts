const stanSingleton = {
  stan: [
    {
      publish: (subject: string, data: string, callback: () => void) => {
        callback();
      },
    },
    undefined,
  ],
};

export default stanSingleton;
