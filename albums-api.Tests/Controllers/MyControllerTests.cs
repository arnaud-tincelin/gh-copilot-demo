using UnsecureApp.Controllers;
using Xunit;
using albums_api.Tests.Mocks;

namespace albums_api.Tests.Controllers;

public class MyControllerTests
{
    private sealed class TestableMyController : MyController
    {
        private readonly Func<string, FileStream> _streamFactory;

        public TestableMyController(Func<string, FileStream> streamFactory)
        {
            _streamFactory = streamFactory;
        }

        protected override FileStream OpenFileStream(string userInput)
        {
            return _streamFactory(userInput);
        }
    }

    [Fact]
    public void ReadFile_WhenPathDoesNotExist_ThrowsFileNotFoundException()
    {
        var controller = new TestableMyController(_ => throw new FileNotFoundException());

        Assert.Throws<FileNotFoundException>(() => controller.ReadFile(Path.GetRandomFileName()));
    }

    [Fact]
    public void ReadFile_WhenMockFileStreamProvided_ReturnsTextContainingFileContent()
    {
        const string expected = "hello world";
        using var mockStream = new MockFileStream(expected);
        var controller = new TestableMyController(_ => mockStream);

        var result = controller.ReadFile("ignored-by-mock");

        Assert.NotNull(result);
        Assert.StartsWith(expected, result);
    }

    [Fact]
    public void GetProduct_WithoutConnectionOnCommand_ThrowsInvalidOperationException()
    {
        var controller = new MyController();

        Assert.Throws<InvalidOperationException>(() => controller.GetProduct("test"));
    }

    [Fact]
    public void GetObject_ShouldNotThrow()
    {
        var controller = new MyController();

        var exception = Record.Exception(() => controller.GetObject());

        Assert.Null(exception);
    }
}
