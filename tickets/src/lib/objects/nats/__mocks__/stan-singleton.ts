const stanSingleton = {
  stan: [
    {
      publish: jest.fn(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
    },
    undefined,
  ],
};

export default stanSingleton;
