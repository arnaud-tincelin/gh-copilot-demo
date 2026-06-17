namespace albums_api.Tests.Mocks;

public sealed class MockFileStream : FileStream
{
    private static string CreateTempFile(byte[] content)
    {
        var tempPath = Path.GetTempFileName();
        File.WriteAllBytes(tempPath, content);
        return tempPath;
    }

    public MockFileStream(string content)
        : base(
            CreateTempFile(System.Text.Encoding.UTF8.GetBytes(content)),
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            4096,
            FileOptions.DeleteOnClose)
    {
    }
}
